# Data Dictionary: Customer Chat Intent Dataset

## 1. Ringkasan & Sumber Data
- **Nama Dataset:** `intent_dataset.csv`
- **Tujuan:** Pelatihan model klasifikasi intent chatbot layanan otomatis WhatsApp UMKM Mie Ayam Surabaya.
- **Karakteristik Sumber:** Data sintetis realistis yang dirancang berdasarkan transkrip percakapan riil pelanggan warung makan lokal di Sidoarjo/Surabaya, memuat dialek lokal, singkatan percakapan (*slang*), serta variasi tata bahasa santai/informal.
- **Keterbatasan (Data Limitations):** Data tidak mencakup seluruh kemungkinan variasi salah ketik (*typo*) ekstrem atau bahasa daerah yang sangat kental tanpa padanan Indonesia. Data disimulasikan sesuai karakteristik interaksi pelanggan warung makan oriental.

---

## 2. Struktur Kolom (Fitur & Target)

| Nama Kolom | Tipe Data | Deskripsi | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `text` | `String` | Kalimat atau teks pesan masuk dari pelanggan via WhatsApp/chat. | `"kak mie ayam komplit seporsi berapa ya?"` |
| `intent` | `String (Kategorikal)` | Label kelas intent tujuan pesan pelanggan (Target Variabel). | `tanya_produk`, `pemesanan`, `keluhan`, `lainnya` |

---

## 3. Definisi Label Kelas Intent (4 Kelas Wajib)

| Label Intent | Definisi Ruang Lingkup | Tindakan Sistem (Routing) |
| :--- | :--- | :--- |
| **`tanya_produk`** | Pertanyaan seputar daftar menu, varian hidangan (mie, bakso, pangsit), harga, kehalalan, porsi, lokasi warung, rute, jam buka/tutup harian, serta konfirmasi hari libur toko. | RAG Knowledge Base Retrieval (ChromaDB) + Gemini API / Local Answer. |
| **`pemesanan`** | Permintaan order makanan (makan di tempat, bungkus bawa pulang/take-away, pesan antar/delivery), reservasi acara kantor/arisan, serta instruksi nomor rekening/metode pembayaran transaksi. | Panduan alur pemesanan resmi warung via WA / Ojol / Format order. |
| **`keluhan`** | Komplain atau keluhan pelanggan terkait keterlambatan pesanan, salah menu, kualitas hidangan (kuah dingin, mie lembek), kekeliruan kembalian kasir, atau higienitas. | **Eskalasi ke Pemilik Usaha** (`escalate_to_owner = true`) & respon permohonan maaf. |
| **`lainnya`** | Sapaan umum (*greeting*), ucapan terima kasih, atau pertanyaan di luar topik bisnis/operasional (*out-of-topic* seperti cuaca, resep rahasia bumbu, politik). | Respon sapaan ramah atau penolakan sopan sesuai Guardrail Anti-OOT. |

---

## 4. Distribusi Kelas & Mitigasi Imbalanced Data
Distribusi kelas mencerminkan dinamika dunia nyata di mana pesan didominasi oleh pertanyaan produk dan pesanan:
- **`tanya_produk`:** ~45%
- **`pemesanan`:** ~25%
- **`keluhan`:** ~15%
- **`lainnya`:** ~15%

Mitigasi ketidakseimbangan kelas ditangani menggunakan **SMOTE (Synthetic Minority Over-sampling Technique)** pada fitur representasi TF-IDF dan bobot kelas berimbang (*class weight balanced*) saat proses pelatihan model.
