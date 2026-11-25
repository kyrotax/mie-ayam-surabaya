"""Preprocessing OpenCV dan segmentasi baris kolom kiri nota tulisan tangan."""

from typing import Any, Dict, List, Optional, Tuple
import cv2
import numpy as np


def decode_image_bytes(image_bytes: bytes) -> Optional[np.ndarray]:
    """Mendekode bytes gambar menjadi array BGR OpenCV."""
    if not image_bytes:
        return None
    nparr = np.frombuffer(image_bytes, np.uint8)
    if nparr.size == 0:
        return None
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


def preprocess_image(image_bytes: bytes) -> bytes:
    """Membersihkan pencahayaan dan kontras gambar lalu mengembalikan bytes PNG ternormalisasi."""
    img = decode_image_bytes(image_bytes)
    if img is None:
        return image_bytes

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    ok, buf = cv2.imencode(".png", enhanced)
    return buf.tobytes() if ok else image_bytes


def build_ink_mask(img: np.ndarray) -> np.ndarray:
    """
    Menghasilkan binary mask tinta tulisan tangan (foreground=255)
    dengan koreksi CLAHE serta penghapusan garis buku tipis.
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img.copy()
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    blurred = cv2.GaussianBlur(enhanced, (3, 3), 0)

    thresh = cv2.adaptiveThreshold(
        blurred,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        15,
        8,
    )

    # Hapus garis horizontal panjang buku tulis agar tidak menyatukan baris atau menipu kontur
    _, w = thresh.shape
    line_len = max(40, int(w * 0.45))
    horiz_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (line_len, 1))
    horiz_lines = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, horiz_kernel)
    cleaned = cv2.subtract(thresh, horiz_lines)
    return cleaned


def _filter_left_column_boxes(
    boxes: List[Tuple[int, int, int, int]],
    img_width: int,
) -> List[Tuple[int, int, int, int]]:
    """
    Mengabaikan kurung kurawal '}' serta angka harga tulis tangan di kolom kanan.
    """
    if not boxes:
        return []

    heights = [bh for (_, _, _, bh) in boxes]
    median_h = float(np.median(heights)) if heights else 20.0

    # 1. Deteksi dan buang kurung kurawal '}' tinggi di tengah/kanan yang merangkum banyak baris
    brace_x_positions: List[int] = []
    no_brace_boxes: List[Tuple[int, int, int, int]] = []
    for bx, by, bw, bh in boxes:
        is_tall_brace = (
            bh > max(median_h * 2.1, 45)
            and bh > bw * 1.6
            and bx > img_width * 0.35
        )
        if is_tall_brace:
            brace_x_positions.append(bx)
        else:
            no_brace_boxes.append((bx, by, bw, bh))

    if not no_brace_boxes:
        return []

    # 2. Tentukan batas X kolom kanan bila ada brace '}' atau celah horizontal lebar menuju kolom harga
    right_cutoff: Optional[float] = None
    if brace_x_positions:
        right_cutoff = float(min(brace_x_positions)) - 4.0
    elif len(no_brace_boxes) >= 2:
        sorted_x = sorted(no_brace_boxes, key=lambda b: b[0])
        widths = [b[2] for b in sorted_x]
        char_scale = max(median_h, float(np.median(widths)), 12.0)
        # Cari celah besar di separuh kanan halaman (pemisah antara nama menu kiri dan harga kanan)
        best_gap = 0.0
        best_split_x: Optional[float] = None
        for idx in range(len(sorted_x) - 1):
            curr_end = sorted_x[idx][0] + sorted_x[idx][2]
            next_start = sorted_x[idx + 1][0]
            gap = next_start - curr_end
            if curr_end > img_width * 0.28 and next_start > img_width * 0.52 and gap > char_scale * 1.8:
                if gap > best_gap:
                    best_gap = gap
                    best_split_x = float(curr_end + gap * 0.5)
        if best_split_x is not None:
            right_cutoff = best_split_x

    if right_cutoff is None:
        return no_brace_boxes

    left_boxes = [b for b in no_brace_boxes if (b[0] + b[2] * 0.5) < right_cutoff]
    return left_boxes if left_boxes else no_brace_boxes


def _cluster_rows_and_tokens(
    boxes: List[Tuple[int, int, int, int]],
) -> List[Dict[str, Any]]:
    """Mengelompokkan bounding box berdasarkan koordinat Y (baris) dan X (token kiri-ke-kanan)."""
    if not boxes:
        return []

    heights = [b[3] for b in boxes]
    median_h = float(np.median(heights)) if heights else 20.0
    row_y_tol = max(12.0, median_h * 0.7)

    sorted_by_y = sorted(boxes, key=lambda b: b[1] + b[3] * 0.5)
    raw_rows: List[List[Tuple[int, int, int, int]]] = []
    row_centers: List[float] = []

    for box in sorted_by_y:
        cy = box[1] + box[3] * 0.5
        if raw_rows and abs(cy - row_centers[-1]) <= row_y_tol:
            raw_rows[-1].append(box)
            row_centers[-1] = float(np.mean([b[1] + b[3] * 0.5 for b in raw_rows[-1]]))
        else:
            raw_rows.append([box])
            row_centers.append(cy)

    structured_rows: List[Dict[str, Any]] = []
    token_gap_tol = max(8.0, median_h * 0.55)

    for row in raw_rows:
        row_sorted = sorted(row, key=lambda b: b[0])
        merged_tokens: List[Tuple[int, int, int, int]] = []
        for bx, by, bw, bh in row_sorted:
            if not merged_tokens:
                merged_tokens.append((bx, by, bw, bh))
                continue
            px, py, pw, ph = merged_tokens[-1]
            gap = bx - (px + pw)
            if gap <= token_gap_tol:
                nx = min(px, bx)
                ny = min(py, by)
                nx2 = max(px + pw, bx + bw)
                ny2 = max(py + ph, by + bh)
                merged_tokens[-1] = (nx, ny, nx2 - nx, ny2 - ny)
            else:
                merged_tokens.append((bx, by, bw, bh))

        rx = min(b[0] for b in merged_tokens)
        ry = min(b[1] for b in merged_tokens)
        rx2 = max(b[0] + b[2] for b in merged_tokens)
        ry2 = max(b[1] + b[3] for b in merged_tokens)
        structured_rows.append(
            {
                "row_bbox": [rx, ry, rx2 - rx, ry2 - ry],
                "token_bboxes": [list(t) for t in merged_tokens],
            }
        )

    return structured_rows


def segment_left_column_rows(image_bytes: bytes) -> Tuple[Optional[np.ndarray], List[Dict[str, Any]]]:
    """
    Mengekstrak gambar dan daftar baris + potongan token kolom kiri secara berurutan atas-ke-bawah.
    """
    img = decode_image_bytes(image_bytes)
    if img is None:
        return None, []

    ink = build_ink_mask(img)
    if cv2.countNonZero(ink) == 0:
        return img, []

    # Dilation tipis untuk menyambungkan goresan pena terputus tanpa menggabungkan kata berbeda
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    connected = cv2.dilate(ink, kernel, iterations=1)
    contours, _ = cv2.findContours(connected, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    _, img_w = ink.shape
    raw_boxes: List[Tuple[int, int, int, int]] = []
    for cnt in contours:
        bx, by, bw, bh = cv2.boundingRect(cnt)
        if bh < 6 or bw < 3:
            continue
        raw_boxes.append((bx, by, bw, bh))

    left_boxes = _filter_left_column_boxes(raw_boxes, img_w)
    rows = _cluster_rows_and_tokens(left_boxes)
    return img, rows
