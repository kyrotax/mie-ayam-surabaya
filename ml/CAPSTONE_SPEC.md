# Capstone Project Asah 2026: Digitalisasi Operasional & AI Assistant UMKM Mie Ayam Surabaya

## 1. Profil UMKM & Permasalahan Bisnis (Use Case)
- **Nama UMKM:** Mie Ayam Surabaya (Kuliner Mie Ayam gaya Oriental)
- **Narasumber:** Evelyn Pricilia Sugiarto (Pemilik)
- **Kondisi & Batasan Operasional Saat Ini:**
  1. Pencatatan pesanan dan rekapitulasi harian dilakukan secara manual di buku tulis karena paling nyaman bagi karyawan dan pemilik di lapangan. Sistem baru **tidak boleh mengubah kebiasaan mencatat manual di kertas**.
  2. Pemilik membatasi akses langsung ke data asli pemasukan dan pengeluaran keuangan yang bersifat sensitif.
- **3 Masalah Utama yang Diselesaikan:**
  1. **Pesan Pelanggan Terlewat Saat Libur:** Saat toko tutup/libur, pesan WhatsApp pelanggan sering tidak terbalas sehingga calon pembeli beralih ke tempat lain dan waktu istirahat pemilik terganggu.
  2. **Ketiadaan Katalog Digital Terpusat:** Calon pelanggan dari Instagram dan TikTok kesulitan mengakses informasi daftar menu, harga, dan jam operasional secara cepat dan mandiri.
  3. **Selisih Data Rekapitulasi Harian:** Rekapitulasi manual dari buku catatan rentan salah hitung, memaksa pemilik menghitung ulang seluruh transaksi dari awal.

---

## 2. Tim Pengembang (3 Learning Path)
1. **Gani Abi Saputra Van Sigu (AE296B6Y0655)** - AI Engineer / Gen AI (AE)
2. **Dicky Karillo Redinata (AE)** - AI Engineer / Gen AI (AE)
3. **Tara Tabriza Rachman (DS284B6X1708)** - Data Science (DS)
4. **Diyanti Pratiwi (DS284B6X0476)** - Data Science (DS)
5. **Talitha Aryana Salsabila (FS296B6X1982)** - Full-Stack Developer (FS)

---

## 3. Arsitektur Sistem & Aturan Ketat Checklist (Strict Rules)
Proyek ini menggunakan arsitektur **Decoupled 3-Tier Microservices** yang wajib mematuhi aturan penilaian berikut:
1. **Frontend (Vite + React + TypeScript + Tailwind CSS + Axios):**
   - Dibangun terpisah dari Backend dan berkomunikasi via HTTP networking call (Axios).
   - **DILARANG** memanggil layanan Gen AI / FastAPI secara langsung dari Frontend. Semua akses AI wajib melewati Backend Express.js.
   - Antarmuka harus responsif (mobile & desktop) dan memberikan indikator status yang jelas (*loading*, *success*, *error*).
2. **Backend Utama (Node.js + Express.js + PostgreSQL/Neon + Joi + Swagger):**
   - **WAJIB menggunakan Express.js** dengan konvensi URL REST API `/api/v1/resource`.
   - Wajib memvalidasi setiap request body menggunakan schema validation (**Joi**).
   - Wajib menyediakan dokumentasi API interaktif (**Swagger / OpenAPI**).
   - Wajib menyimpan data bisnis dan **riwayat hasil layanan Gen AI & ML** secara persisten di database.
3. **AI Service (Python + FastAPI + PyTorch/Scikit-learn + OpenCV + ChromaDB + Gemini API):**
   - Menyajikan seluruh model ML yang dilatih sendiri (Custom OCR & Intent Classification) serta fitur Gen AI melalui REST API berbasis **FastAPI**.
   - Menangani *error*, input tidak valid, serta kondisi saat API model generatif lambat atau terkena *rate limit* kuota gratis (`429`) dengan *fallback* lokal dari model yang dilatih sendiri.
4. **Data Science Service & Dashboard (Python + Pandas + Scikit-learn/XGBoost + Streamlit):**
   - Menyediakan dataset berlabel untuk tim AE (dataset gambar tulisan tangan buku catatan & dataset teks intent pelanggan) dengan pemisahan *train/test split* bebas *data leakage* beserta *Data Dictionary*.
   - Membangun model prediksi (*forecasting* penjualan/permintaan menu) dan dasbor interaktif **Streamlit** yang diintegrasikan ke aplikasi web.

---

## 4. Spesifikasi Fitur & Model AI (Scope AE & DS)

### A. Pipeline Scan Buku Catatan Harian: Custom-Trained OCR + Gen AI Structuring (AE)
1. **Tahap 1: Image Preprocessing & Line/Grid Segmentation (OpenCV)**
   - Foto lembaran buku catatan transaksi harian diproses menggunakan OpenCV (*grayscale*, *adaptive thresholding*, *deskewing* koreksi kemiringan, dan *contour/grid cropping*) untuk memotong baris dan kolom pesanan (`nama_menu`, `qty`, `metode_bayar`).
2. **Tahap 2: Model Deteksi & Pengenalan Tulisan Tangan yang Dilatih Sendiri (Main Quest)**
   - Melatih model Computer Vision / OCR sendiri menggunakan dataset tulisan tangan menu, angka kuantitas, dan tipe pembayaran (Tunai/QRIS) yang disiapkan bersama tim DS.
   - **Penanganan Imbalanced Data & Augmentasi:** Memeriksa keseimbangan jumlah sampel gambar antarkelas dan menerapkan *Image Data Augmentation* (rotasi tipis, *color jitter* bayangan HP, *gaussian blur*) untuk menyeimbangkan kelas dan meningkatkan akurasi.
   - **Eksperimen Minimal 2 Model:** Membandingkan minimal 2 arsitektur model (misal: **MobileNetV2** vs **ResNet18** untuk klasifikasi kata/angka buku catatan, atau **CRNN** vs **Fine-tuned TrOCR**) dengan metrik evaluasi **Macro F1-Score** (dan CER/WER) pada *test set* terpisah.
3. **Tahap 3: Penguatan & Normalisasi dengan Gemini API + Local Fallback (Main Quest)**
   - Output teks mentah dan *confidence score* dari model Custom OCR dikirim ke **Gemini API** (`gemini-2.5-flash`) untuk menormalisasi singkatan menu (contoh: `"MA Jmr"` -> `"Mie Ayam Jamur Oriental"`), mencocokkan harga satuan, menghitung subtotal otomatis, membuat ringkasan laporan harian, dan mengeluarkan format **Structured JSON**.
   - **Local Fallback (Keandalan):** Jika kuota gratis Gemini API habis (`429`) atau *timeout*, sistem otomatis beralih ke *Rule-Based Dictionary Parser* lokal di Python sehingga fitur *scan* buku catatan tetap berfungsi 100% menggunakan hasil model Custom OCR.

### B. Pipeline Chatbot Otomatis Saat Libur: Intent Classification + RAG (AE)
1. **Model Klasifikasi Intent (Main Quest + Side Quest):**
   - Melatih model klasifikasi teks pada dataset pesan pelanggan dengan **minimal 4 kelas intent**:
     - `tanya_produk` (menu, harga, lokasi, jam operasional/hari libur)
     - `pemesanan` (cara order via WhatsApp / Gojek)
     - `keluhan` (komplain pesanan atau layanan)
     - `lainnya` (sapaan umum atau pertanyaan di luar konteks bisnis)
   - Menerapkan *text preprocessing*, menangani *imbalanced data* (SMOTE / *class weight*), serta membandingkan minimal 2 model (misal: **TF-IDF + SVM** vs **Logistic Regression / IndoBERT**) dengan metrik **F1-Score**.
2. **Sistem RAG & Guardrails (Side Quest):**
   - Komponen RAG terdiri dari: *Embedding Model*, *Vector Database* (**ChromaDB** / **FAISS**), dan *Generation Model* (**Gemini API** atau Local Open-Source SLM/LLM via Ollama).
   - **Routing Berdasarkan Intent:** Jika intent = `tanya_produk` atau `pemesanan`, jawab otomatis menggunakan konteks dari RAG. Jika intent = `keluhan`, kembalikan *flag* eskalasi agar diteruskan ke pemilik usaha.
   - **Structured Prompt & Anti-OOT Guardrail:** Menggunakan *template* & *few-shot prompting* sesuai gaya bahasa ramah UMKM, serta membatasi chatbot agar menolak sopan pertanyaan di luar konteks usaha (diuji dengan **minimal 10 pertanyaan di luar konteks** di README).

### C. Model Tambahan: Analisis Sentimen Pelanggan (AE - Side Quest)
- Melatih model klasifikasi sentimen ulasan pelanggan dengan minimal 2 kelas (`positif` dan `negatif`) untuk ditampilkan pada aplikasi web atau dasbor bisnis.

### D. Penyediaan Data, Forecasting & Dasbor Interaktif (DS)
- **Penyediaan Data untuk AI:** Menyusun dataset gambar potongan tulisan tangan catatan transaksi dan dataset teks pesan pelanggan, lengkap dengan label sumber data (primer/dummy/publik), keterbatasan, dan *Data Dictionary*.
- **Model Prediksi (Side Quest):** Model *regression/forecasting* untuk memprediksi estimasi porsi penjualan harian guna membantu persiapan stok bahan baku.
- **Dasbor Streamlit (Side Quest):** Menampilkan indikator bisnis harian, filter interaktif, fitur unggah file untuk pembaruan data, dan di-embed ke dalam aplikasi web Full-Stack.

---

## 5. Kontrak API Antar-Layanan (API Contract)

### 1. Backend Utama (Express.js - Port 3000) -> Diakses oleh React Frontend
- `GET /api/v1/menus` : Mengambil daftar katalog menu dan status operasional toko.
- `POST /api/v1/chat` : Menerima pesan pelanggan, validasi dengan Joi, memanggil FastAPI `/api/v1/ai/chat`, menyimpan riwayat ke DB, dan mengembalikan balasan.
- `POST /api/v1/recaps/scan` : Menerima unggahan gambar buku catatan (`multipart/form-data`), meneruskan ke FastAPI `/api/v1/ai/ocr-recap`, dan menyimpan draf rekap.
- `PUT /api/v1/recaps/:id` : Memperbarui dan mengonfirmasi laporan rekapitulasi harian setelah diverifikasi pemilik di tabel pratinjau.
- `GET /api/v1/analytics/summary` : Mengambil ringkasan transaksi, sentimen, dan prediksi dari layanan DS/DB.

### 2. Layanan AI & DS (FastAPI - Port 8000) -> Diakses Internal oleh Express.js
- `POST /api/v1/ai/ocr-recap`
  - **Alur Internal:** Image Input -> OpenCV Segmentation -> **Custom-Trained OCR Model (.pth/.onnx)** -> **Gemini API Normalizer & Summarizer** (dengan fallback ke Local Rule Parser) -> Output JSON.
  - **Response JSON:**
    ```json
    {
      "status": "success",
      "engine_used": "custom_ocr_plus_gemini",
      "tanggal_catatan": "2026-11-14",
      "items": [
        {
          "teks_mentah_ocr": "MA Jmr | 3 | QRS",
          "ocr_confidence": 0.93,
          "nama_menu": "Mie Ayam Jamur Oriental",
          "qty": 3,
          "harga_satuan": 18000,
          "subtotal": 54000,
          "metode_bayar": "QRIS"
        }
      ],
      "total_tunai": 150000,
      "total_qris": 240000,
      "grand_total": 390000,
      "ringkasan_harian": "Total penjualan hari ini Rp390.000 dengan mayoritas pembayaran via QRIS.",
      "perlu_tinjauan_manual": false
    }
    ```
- `POST /api/v1/ai/chat`
  - **Alur Internal:** Text Input -> **Custom Intent Classifier (.joblib)** -> Routing (ChromaDB RAG + Gemini API atau Eskalasi Keluhan) -> Output JSON.
  - **Response JSON:**
    ```json
    {
      "status": "success",
      "predicted_intent": "tanya_produk",
      "confidence": 0.94,
      "reply": "Halo Kak! Mohon maaf saat ini toko sedang libur. Untuk hari normal kami buka pukul 09.00 - 20.00 WIB. Menu Mie Ayam Jamur Oriental tersedia dengan harga Rp18.000/porsi.",
      "escalate_to_owner": false,
      "sources": ["menu_catalog.md", "operational_hours.md"]
    }
    ```
- `POST /api/v1/ai/sentiment` : Mengklasifikasikan teks ulasan pelanggan menjadi `positif` atau `negatif`.
- `POST /api/v1/ds/predict-demand` : Mengembalikan prediksi penjualan harian berdasarkan parameter hari dan tren historis.

---

## 6. Struktur Dokumentasi Wajib di README (Untuk Penilaian)
1. **Sumber Data & Library:** Daftar dataset primer/sintetis (gambar tulisan tangan buku catatan & teks chat), dataset publik pendukung (misal EMNIST), API publik, dan library yang dipakai beserta keterbatasannya.
2. **Penanganan Imbalanced Data:** Distribusi jumlah data per kelas sebelum dan sesudah penanganan (Image Augmentation / Class Weight pada dataset OCR, serta SMOTE pada dataset Intent).
3. **Tabel Evaluasi & Perbandingan Model (Wajib Minimal 2 Model):**
   - **A. Model Custom OCR / Handwriting Recognition:**
     | Nama Model / Konfigurasi | Teknik Preprocessing & Augmentasi | Macro F1-Score | Akurasi / CER | Keterangan |
     | :--- | :--- | :---: | :---: | :--- |
     | Model 1 (MobileNetV2 Transfer Learning) | OpenCV Adaptive Threshold, Rotation, ColorJitter | [Isi] | [Isi] | Baseline Ringan |
     | Model 2 (ResNet18 / TrOCR Fine-tuned) | OpenCV Deskew, Augmentation + Hyperparameter Tuning | [Isi] | [Isi] | Model Terpilih |
   - **B. Model Klasifikasi Intent (4 Kelas):**
     | Nama Model / Konfigurasi | Teknik Preprocessing & Tuning | Macro F1-Score | Weighted F1-Score | Keterangan |
     | :--- | :--- | :---: | :---: | :--- |
     | Model 1 (TF-IDF + Logistic Regression) | Case folding, Slang norm, SMOTE | [Isi] | [Isi] | Baseline |
     | Model 2 (TF-IDF + SVM Linear Tuned) | GridSearchCV (`C`, `ngram_range`) | [Isi] | [Isi] | Model Terpilih |
4. **Pengujian Guardrail 10 Pertanyaan di Luar Konteks (OOT):**
   Tabel berisi 10 pertanyaan di luar konteks bisnis Mie Ayam Surabaya beserta bukti tanggapan penolakan sopan dari chatbot.
