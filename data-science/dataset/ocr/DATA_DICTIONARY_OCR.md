# Data Dictionary: Handwriting OCR Dataset Buku Catatan

## 1. Ringkasan & Sumber Data
- **Direktori:** `data-science/dataset/ocr/`
- **Tujuan:** Pelatihan model Computer Vision / Custom OCR pengenal tulisan tangan nota & rekapitulasi buku catatan harian UMKM Mie Ayam Surabaya.
- **Teknik Sintesis & Augmentasi:** Dibuat menggunakan kombinasi font tulisan tangan autentik (`Inkfree`, `Segoe Print`), disimulasikan dengan tekstur kertas bergaris, variasi tinta pulpen, sudut rotasi tulisan tangan, serta bayangan pencahayaan smartphone saat difoto.
- **Pembagian Data:** 
  - Train: 640 sampel (40 gambar/kelas, 80%)
  - Test: 160 sampel (10 gambar/kelas, 20%)

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
