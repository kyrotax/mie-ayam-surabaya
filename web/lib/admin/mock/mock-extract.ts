import { ExtractionJob, ExtractionResult } from "../types";

// Hash string helper sederhana
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function mockExtract(filename: string, photoDataUrl: string): ExtractionJob {
  const lowerName = filename.toLowerCase();

  // Jika nama file mengandung 'gagal', simulasikan job gagal
  if (lowerName.includes("gagal")) {
    return {
      id: `job_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "gagal",
      photoUrl: photoDataUrl,
      errorMessage:
        "Foto tidak dapat diproses: teks catatan buram atau kontras terlalu rendah. Silakan unggah foto yang lebih terang atau gunakan input manual.",
    };
  }

  const hash = simpleHash(filename);
  const variant = hash % 3;

  let result: ExtractionResult;

  if (variant === 0) {
    result = {
      needsReview: true,
      items: [
        {
          name: "Mie Ayam Original",
          qty: 2,
          confidence: 0.96,
          menuItemId: 1,
          note: "1 tanpa sawi",
        },
        {
          name: "Bakso Sapi Tambahan",
          qty: 1,
          confidence: 0.58,
          menuItemId: 5,
          note: "cek porsi",
        },
        {
          name: "kerupuk putih kaleng",
          qty: 2,
          confidence: 0.31,
          menuItemId: null,
          note: "menu tidak ditemukan",
        },
        {
          name: "Es Teh Manis",
          qty: 2,
          confidence: 0.94,
          menuItemId: 7,
          note: "manis sedang",
        },
      ],
    };
  } else if (variant === 1) {
    result = {
      needsReview: true,
      items: [
        {
          name: "Mie Ayam Pangsit",
          qty: 3,
          confidence: 0.91,
          menuItemId: 2,
          note: "pangsit goreng dipisah",
        },
        {
          name: "Pangsit Goreng",
          qty: 1,
          confidence: 0.65,
          menuItemId: 6,
          note: "tambahan",
        },
        {
          name: "Teh Hangat",
          qty: 3,
          confidence: 0.88,
          menuItemId: 8,
        },
      ],
    };
  } else {
    result = {
      needsReview: true,
      items: [
        {
          name: "Mie Ayam Komplit",
          qty: 2,
          confidence: 0.89,
          menuItemId: 4,
          note: "kuah dipisah",
        },
        {
          name: "es blewah segar",
          qty: 1,
          confidence: 0.42,
          menuItemId: null,
          note: "tidak ada di daftar menu",
        },
        {
          name: "Es Teler Istimewa",
          qty: 2,
          confidence: 0.74,
          menuItemId: 9,
          note: "tanpa nangka",
        },
      ],
    };
  }

  return {
    id: `job_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "perlu_review",
    photoUrl: photoDataUrl,
    result,
  };
}

