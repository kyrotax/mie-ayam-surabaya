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
