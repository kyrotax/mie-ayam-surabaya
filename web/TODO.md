# Catatan Pengisian Data & TODO Pemilik (Fase 1)

Dokumen ini mencatat data yang telah terintegrasi dari dokumen konsep, revisi visual, dan menu, serta catatan untuk pemilik usaha:

## 1. Data yang Berhasil Terisi & Terhubung ke Database
- **Nama Usaha:** Mie Ayam Surabaya
- **Tagline:** "Cita Rasa Khas Mie Ayam Oriental di Surabaya & Sidoarjo"
- **Cerita Usaha:** Telah diintegrasikan ke halaman `/tentang` dan database sesuai narasi pemilik.
- **Alamat Lengkap:** Jl. Raya Taman Pinang Indah, Jetis, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213
- **Nomor WhatsApp:** `0823 1919 5854` (link format `6282319195854`)
- **Instagram:** `@mieayamsurabaya_` (https://www.instagram.com/mieayamsurabaya_/)
- **Google Maps:** Telah dipasang link langsung dan embed iframe peta interaktif di `/lokasi`.
- **Daftar Menu Resmi dengan Aset Foto Hidangan (dari `menu.png` & foto autentik):**
  - Makanan:
    1. Mie Ayam: Rp 20.000 (`/images/menu/mie-ayam.png`)
    2. Mie Ayam Pangsit: Rp 25.000 (`/images/menu/mie-pangsit.png`)
    3. Mie Ayam Bakso: Rp 25.000 (`/images/menu/kuah-kaldu.png`)
    4. Mie Ayam Komplit: Rp 30.000 (`/images/menu/mie-komplit.png`)
  - Minuman:
    1. Es Teh: Rp 5.000 (`/images/menu/es-teh.jpg`)
    2. Teh Hangat: Rp 5.000 (`/images/menu/teh-hangat.jpg`)
    3. Es Teler: Rp 15.000 (`/images/menu/es-teler.jpg`)
- **Aset Visual:**
  - `fotomie.png`: Foto hidangan autentik semangkuk mie ayam komplit dengan kuah kaldu dan pangsit
  - `logo.jpg`: Logo resmi ilustrasi ayam jago pilinan mie emas khas oriental
  - `menu.png`: Papan menu resmi warung dengan ornamen oriental
- **Desain UI/UX & Antislop Compliance (Referensi Saigetsu Asian Food Presentation):**
  - Mengikuti palet resmi: Terracotta Red (`#BA382A`), Deep Wine (`#8B1E1E`), Warm Ochre (`#D97330`), Crisp Dark Stone (`#1C1917`), Porcelain White (`#FFFFFF`).
  - Tipografi: Headings **Oswald Condensed**, Body **Plus Jakarta Sans** (via `next/font/google`).
  - Status Warung: Indikator status arsitektural minimalis dan elegan dengan live beacon dan jam operasional nyata (bukan kartun plakat gantung).
  - Foto Menu: Setiap item menu kini menampilkan foto hidangan yang menggugah selera.
  - Galeri Warung: Bagian galeri artifisial ("Potret Dokumentasi") telah dihapus sesuai arahan user; seluruh foto difokuskan langsung ke sajian makanan dan minuman di kartu menu.
  - Memenuhi standar WCAG AA, mobile responsive tanpa overflow horizontal, tap target minimum 44px, dan bebas karakter em dash.

## 2. Catatan Konfigurasi Lanjutan untuk Pemilik
- **Jam Operasional Fleksibel:** Jadwal saat ini diset standar 09.00 sampai 21.00 WIB setiap hari dengan mode `manualOverride = true` (status selalu BUKA terkontrol). Di Fase 2 (Dashboard Toko), pemilik dapat mengubah status ini langsung melalui tombol saklar Buka/Tutup di panel admin.
- **Pembaruan Foto Menu:** Foto hidangan saat ini telah tertaut ke masing-masing item menu. Di Fase 2, pemilik dapat mengganti atau menambah foto baru melalui panel admin.


## 3. Realisasi Fase 2 (Dashboard Admin - Frontend Dummy)
- **Status:** SELESAI & LULUS BUILD
- **Komponen & Arsitektur yang Dibangun:**
  1. **Autentikasi & Guard Rute:** Middleware `middleware.ts` membaca cookie `mm_session` (base64url) dengan masa berlaku 8 jam. Penjagaan ganda di server layout `(panel)/layout.tsx` dan proteksi izin halaman via `lib/admin/permissions.ts`.
  2. **Akun Dummy:** Owner (`owner@mieayam.test` / `Owner123!`), Admin (`admin@mieayam.test` / `Admin123!`), dan Akun Nonaktif (`admin2@mieayam.test`).
  3. **Lapisan Layanan (Services Layer):** Seluruh interaksi UI memanggil modul di `lib/admin/services/*` dengan artificial latency 300-500ms dan persistensi `localStorage` (`mm_dummy_state_v1`) via `store.tsx`.
  4. **Dashboard 1 (Profil & Toko):**
     - `/admin`: Ringkasan KPI, saklar cepat status, grafik 7 hari, 5 pesanan terbaru, aktivitas terkini.
     - `/admin/toko`: Saklar Buka/Tutup dengan modal alasan dan estimasi jam, mode jadwal/paksa, tabel jadwal 7 hari, log aktivitas, dan pratinjau WhatsApp.
     - `/admin/konten`: Tab Profil, Tentang, Kontak & Lokasi (read-only Admin), Galeri Hidangan (urutan naik/turun, alt text), Testimoni, serta floating save bar.
     - `/admin/menu`: Manajemen daftar menu, saklar stok habis inline, urutan naik/turun, drawer tambah/ubah, validasi harga & alias AI unik.
     - `/admin/chatbot`: Tab auto-reply WhatsApp dengan tag variabel `{jam_buka_kembali}` dan `{alasan}`, tab FAQ interaktif, serta tab log obrolan pelanggan (tersamarkan).
  5. **Dashboard 2 (Pesanan & AI):**
     - `/admin/pesanan/baru`: Dropzone kamera HP & unggah berkas dengan kompresi gambar sisi klien, simulasi langkah OCR, dan trigger job gagal via kata kunci nama file `gagal`.
     - `/admin/pesanan/[id]/review`: Panel ganda foto & tabel ekstraksi porsi, stepper, kalkulasi subtotal/total otomatis, verifikasi keyakinan AI, dan validasi simpan pesanan.
     - `/admin/pesanan`: Riwayat transaksi terfilter rentang tanggal dan sumber, paginasi 10 baris, dan ekspor CSV langsung di browser.
     - `/admin/pesanan/[id]`: Detail transaksi dengan foto berdampingan dan opsi hapus pesanan bagi Owner.
     - `/admin/laporan`: Analitik KPI omset estimasi, grafik tren harian, menu terlaris, jam ramai, serta fitur ekspor CSV dan cetak ramah printer.
     - `/admin/akun`: Manajemen pengguna, validasi email unik, proteksi akun sendiri dan pencegahan penghapusan Owner terakhir.
  6. **Aksesibilitas & UI Antislop:** Seluruh warna berdasar palet Saigetsu & token semantik dashboard, kontras WCAG AA, tap target minimum 44px, responsif pada lebar 360px - 1280px, dan bebas horizontal scroll.
