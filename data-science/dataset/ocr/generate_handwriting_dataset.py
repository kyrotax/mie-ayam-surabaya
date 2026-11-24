"""
Generator Dataset Gambar Potongan Tulisan Tangan Buku Catatan Transaksi Mie Ayam Surabaya.
Mensintesis potongan gambar kata menu, angka kuantitas, dan tipe pembayaran
menggunakan font tulisan tangan autentik (Inkfree, Segoe Print) dengan augmentasi efek fisik kertas:
- Tekstur kertas bergaris / buku tulis
- Warna tinta pulpen (biru pekat, hitam, biru pudar)
- Rotasi kemiringan tulisan tangan (-10 s/d +10 derajat)
- Gradient bayangan HP (lighting variation)
- Noise & sedikit blur optik kamera HP
"""

import os
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

random.seed(42)
np.random.seed(42)

CLASSES = [
    "MA", "MAP", "MAB", "MAK", "BKS", "PGR", "ESTEH", "TEH", "TELER",
    "1", "2", "3", "4", "5",
    "TUNAI", "QRIS"
]

FONT_PATHS = [
    r"C:\Windows\Fonts\Inkfree.ttf",
    r"C:\Windows\Fonts\segoepr.ttf",
    r"C:\Windows\Fonts\segoeprb.ttf",
    r"C:\Windows\Fonts\comic.ttf",
    r"C:\Windows\Fonts\arial.ttf"
]

# Pastikan hanya font yang benar-benar ada di sistem
VALID_FONTS = [f for f in FONT_PATHS if os.path.exists(f)]
if not VALID_FONTS:
    VALID_FONTS = [None] # Default bitmap

INK_COLORS = [
    (15, 30, 80),   # Biru pulpen standar
    (20, 20, 30),   # Hitam pulpen gel
    (30, 45, 100),  # Biru agak pudar
    (40, 40, 50),   # Abu gelap
    (10, 20, 60),   # Biru dongker
]

def create_handwritten_crop(text: str, width: int = 128, height: int = 64) -> Image.Image:
    # 1. Warna latar belakang kertas buku tulis (off-white / krem)
    bg_color = (
        random.randint(240, 252),
        random.randint(238, 250),
        random.randint(230, 245)
    )
    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # 2. Garis tipis buku tulis (grid/ruled line simulasi)
    if random.random() > 0.4:
        line_y = random.randint(height - 18, height - 8)
        line_color = (random.randint(180, 210), random.randint(200, 225), random.randint(220, 245))
        draw.line([(0, line_y), (width, line_y)], fill=line_color, width=1)

    # 3. Pilih font dan ukuran
    font_path = random.choice(VALID_FONTS)
    font_size = random.randint(26, 36)
    if len(text) > 4:
        font_size = random.randint(20, 26)

    try:
        font = ImageFont.truetype(font_path, font_size) if font_path else ImageFont.load_default()
    except Exception:
        font = ImageFont.load_default()

    # 4. Hitung bounding box teks agar berada di tengah
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    # Jitter posisi teks
    x = max(2, (width - text_w) // 2 + random.randint(-5, 5))
    y = max(2, (height - text_h) // 2 + random.randint(-4, 4))

    # Warna tinta pulpen
    ink = random.choice(INK_COLORS)

    # Efek coretan tebal tipis pulpen (gambar ganda dengan sedikit offset)
    draw.text((x, y), text, font=font, fill=ink)
    if random.random() > 0.5:
        draw.text((x + 0.5, y + 0.5), text, font=font, fill=ink)

    # 5. Transformasi affine / rotasi tulisan tangan (-10 s/d +10 derajat)
    angle = random.uniform(-9.0, 9.0)
    img = img.rotate(angle, resample=Image.Resampling.BILINEAR, fillcolor=bg_color)

    # 6. Gradient bayangan smartphone / pencahayaan miring
    if random.random() > 0.3:
        shadow_overlay = Image.new("L", (width, height), color=255)
        shadow_draw = ImageDraw.Draw(shadow_overlay)
        start_intensity = random.randint(190, 230)
        for i in range(width):
            intensity = int(start_intensity + (255 - start_intensity) * (i / width))
            shadow_draw.line([(i, 0), (i, height)], fill=intensity)
        img_np = np.array(img).astype(float)
        shadow_np = np.array(shadow_overlay)[:, :, None] / 255.0
        img_np = np.clip(img_np * shadow_np, 0, 255).astype(np.uint8)
        img = Image.fromarray(img_np)

    # 7. Sedikit blur kamera realistis
    if random.random() > 0.6:
        img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 0.7)))

    return img

def main():
    base_dir = "data-science/dataset/ocr"
    train_dir = os.path.join(base_dir, "train")
    test_dir = os.path.join(base_dir, "test")

    train_samples_per_class = 40
    test_samples_per_class = 10

    total_train = 0
    total_test = 0

    print("=" * 60)
    print("MENGHASILKAN DATASET GAMBAR TULISAN TANGAN BUKU CATATAN")
    print("=" * 60)

    for cls in CLASSES:
        cls_train_dir = os.path.join(train_dir, cls)
        cls_test_dir = os.path.join(test_dir, cls)
        os.makedirs(cls_train_dir, exist_ok=True)
        os.makedirs(cls_test_dir, exist_ok=True)

        # Generate train
        for i in range(train_samples_per_class):
            img = create_handwritten_crop(cls)
            img.save(os.path.join(cls_train_dir, f"{cls}_{i+1:03d}.jpg"), quality=92)
            total_train += 1

        # Generate test
        for i in range(test_samples_per_class):
            img = create_handwritten_crop(cls)
            img.save(os.path.join(cls_test_dir, f"{cls}_{i+1:03d}.jpg"), quality=92)
            total_test += 1

    print(f"\nSelesai! {len(CLASSES)} kelas:")
    print(f"Total gambar latih (train): {total_train} sampel ({train_samples_per_class} per kelas)")
    print(f"Total gambar uji (test):   {total_test} sampel ({test_samples_per_class} per kelas)")
    print(f"Lokasi train: {train_dir}")
    print(f"Lokasi test:  {test_dir}")

    # Buat DATA_DICTIONARY_OCR.md
    dict_content = f"""# Data Dictionary: Handwriting OCR Dataset Buku Catatan

## 1. Ringkasan & Sumber Data
- **Direktori:** `data-science/dataset/ocr/`
- **Tujuan:** Pelatihan model Computer Vision / Custom OCR pengenal tulisan tangan nota & rekapitulasi buku catatan harian UMKM Mie Ayam Surabaya.
- **Teknik Sintesis & Augmentasi:** Dibuat menggunakan kombinasi font tulisan tangan autentik (`Inkfree`, `Segoe Print`), disimulasikan dengan tekstur kertas bergaris, variasi tinta pulpen, sudut rotasi tulisan tangan, serta bayangan pencahayaan smartphone saat difoto.
- **Pembagian Data:** 
  - Train: {total_train} sampel ({train_samples_per_class} gambar/kelas, 80%)
  - Test: {total_test} sampel ({test_samples_per_class} gambar/kelas, 20%)

---

## 2. Daftar 16 Kelas Tulisan Tangan

| ID Kelas | Label Target | Kategori | Arti / Deskripsi Entitas |
| :---: | :--- | :--- | :--- |
| 1 | `MA` | Singkatan Menu | Mie Ayam Original |
| 2 | `MAP` | Singkatan Menu | Mie Ayam Pangsit |
| 3 | `MAB` | Singkatan Menu | Mie Ayam Bakso |
| 4 | `MAK` | Singkatan Menu | Mie Ayam Komplit |
| 5 | `BKS` | Singkatan Menu | Bakso Sapi Tambahan (Porsi) |
| 6 | `PGR` | Singkatan Menu | Pangsit Goreng (Porsi) |
| 7 | `ESTEH` | Singkatan Menu | Es Teh Manis |
| 8 | `TEH` | Singkatan Menu | Teh Hangat |
| 9 | `TELER` | Singkatan Menu | Es Teler Istimewa |
| 10 | `1` | Angka Kuantitas | Jumlah 1 porsi |
| 11 | `2` | Angka Kuantitas | Jumlah 2 porsi |
| 12 | `3` | Angka Kuantitas | Jumlah 3 porsi |
| 13 | `4` | Angka Kuantitas | Jumlah 4 porsi |
| 14 | `5` | Angka Kuantitas | Jumlah 5 porsi |
| 15 | `TUNAI` | Metode Bayar | Pembayaran Kas / Uang Tunai |
| 16 | `QRIS` | Metode Bayar | Pembayaran Non-Tunai / Barcode QRIS |
"""
    with open("data-science/dataset/ocr/DATA_DICTIONARY_OCR.md", "w", encoding="utf-8") as f:
        f.write(dict_content)
    print("Data Dictionary OCR tersimpan di: data-science/dataset/ocr/DATA_DICTIONARY_OCR.md")

if __name__ == "__main__":
    main()
