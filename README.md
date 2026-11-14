# Mie Ayam System

Monorepo arsitektur sistem Mie Ayam Surabaya.

## Struktur Direktori
- `docs/`: Dokumentasi API contract, ERD, dan Flow sistem.
- `web/`: Next.js frontend (Company Profile & Dashboard Admin Fase 2).
- `ml/`: FastAPI ML service untuk OCR & entity extraction.
- `data-science/`: Dataset, notebooks, evaluasi model, dan analitik.

---

## Dashboard Admin (Fase 2: Frontend Dummy)

Dashboard Admin dirancang mobile-first untuk memvalidasi alur operasional dan interaksi pengguna (Owner & Kasir) sebelum disambungkan ke backend API di fase berikutnya.

### 1. Cara Menjalankan
```bash
# Masuk ke direktori web
cd web

# Jalankan server pengembangan
npm run dev
```
Buka browser di `http://localhost:3000/admin`. Tidak ada tautan publik dari situs company profile menuju dashboard ini.

### 2. Akun Demo & Akses
Kredensial akun demo berikut tersimpan secara lokal di `lib/admin/mock/users.ts`:

| Peran | Email | Kata Sandi | Keterangan |
|---|---|---|---|
| **Owner** | `owner@mieayam.test` | `Owner123!` | Akses penuh: Toko, Konten, Menu, Chatbot, Pesanan, Laporan, Kelola Akun |
| **Admin (Kasir)** | `admin@mieayam.test` | `Admin123!` | Akses operasional: Status Toko, Menu (tanpa hapus), Pesanan AI, Laporan |
| **Nonaktif** | `admin2@mieayam.test` | `Admin123!` | Akun uji untuk memicu validasi "Akun dinonaktifkan" |

Pada halaman `/admin/login`, tersedia tombol **"Akun Demo Cepat"** untuk pengisian formulir instan (selama `NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=true`).

### 3. Catatan Keamanan (Penting - Sesuai Spesifikasi Bagian 3.5)
> [!IMPORTANT]
> Autentikasi dan sesi dashboard pada Fase 2 ini adalah **simulasi murni (dummy)**. Kata sandi tersimpan langsung di kode sumber dummy dan cookie sesi (`mm_session`) hanya di-encode dalam format base64url tanpa tanda tangan kriptografi (signature).
> 
> **JANGAN PERNAH MENGGUNAKAN UNTUK DATA SUNGGUHAN ATAU LINGKUNGAN PRODUKSI.**
> Di fase backend (Fase 3), seluruh lapisan dummy ini diisolasi di `lib/admin/auth/` dan `lib/admin/services/auth-service.ts` agar mudah diganti dengan:
> - Otentikasi JWT httpOnly sungguhan dari Core API
> - Enkripsi hash kata sandi (Argon2 / bcrypt)
> - Rate limiting server-side & proteksi CSRF
> - Optional 2FA

Jika aplikasi di-deploy untuk demo publik, pastikan variabel berikut diset:
```env
NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=false
```

### 4. Cara Menguji Simulasi AI Ekstraksi Catatan
- **Alur Sukses & Review**: Ambil foto atau unggah gambar apa pun di `/admin/pesanan/baru`. AI akan memproses secara bertahap dan memunculkan hasil ekstraksi dengan tingkat keyakinan (confidence) dan pemetaan menu otomatis.
- **Memicu Job Gagal**: Unggah berkas gambar dengan nama yang memuat kata `gagal` (contoh: `catatan-gagal.jpg` atau `gagal_foto.png`). Sistem akan menyimulasikan kegagalan OCR (karena buram/kontras rendah) dan menampilkan `ErrorState` beserta opsi "Foto Ulang" dan "Input Manual".
