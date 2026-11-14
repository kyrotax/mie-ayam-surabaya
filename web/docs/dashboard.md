Spesifikasi Fase 2: Dashboard Admin (Frontend Dummy)

Instruksi kerja untuk AI agent (Claude Code, Cursor, dsb.). Baca seluruhnya sebelum menulis kode, lalu kerjakan berurutan sesuai bagian 11. Dokumen ini melanjutkan Fase 1 (company profile) di folder web/ yang sama. Pakai ulang token desain, font, komponen (Button, GoldDivider, StatusBadge), lib/format.ts, dan logo dari Fase 1. Jangan mengubah tampilan atau isi company profile, kecuali menambah hal yang dibutuhkan bersama (mis. token warna semantik) dan mencatatnya di README.

1. Konteks dan tujuan

Sistem ini membantu UMKM mie ayam di Surabaya. Company profile (situs publik) sudah jadi. Fase 2 membangun dashboard admin sebagai frontend dummy: semua halaman, alur, dan interaksi berfungsi secara visual dengan data contoh, tanpa backend, database, ML, maupun WhatsApp sungguhan. Tujuannya: memvalidasi desain dan alur bersama pemilik UMKM, lalu disambungkan ke backend di fase berikutnya tanpa menulis ulang tampilan.

Dashboard terdiri dari dua bagian yang tampil dalam satu aplikasi:

Dashboard 1, Profil & Toko: status buka/tutup, konten situs, menu, chatbot.
Dashboard 2, Pesanan & AI: input pesanan dari foto catatan (hasil ekstraksi AI disimulasikan), review, riwayat, laporan.

Pengguna utama memakai HP (memotret catatan, mengubah status toko), jadi semua halaman mobile-first.

2. Lingkup

Dikerjakan:

Autentikasi dummy + penjagaan rute (bagian 3), dua peran: owner dan admin
Semua halaman di bagian 9, dengan data contoh yang tersimpan di localStorage
Lapisan data (services) yang meniru kontrak API masa depan (bagian 7 dan 14)
Tema dashboard yang selaras dengan company profile (bagian 8)

Jangan dibuat:

Backend sungguhan: database, Prisma, API route data, JWT asli, hashing password
Service ML/AI, WhatsApp Cloud API, webhook, cron, upload ke storage sungguhan
Tautan ke /admin di UI company profile
Pengaruh dashboard terhadap situs publik (perubahan di dashboard belum mengubah company profile; itu diurus di fase backend)
3. Akses dan autentikasi (DUMMY)
3.1 Aturan akses
Satu domain yang sama dengan situs publik. Dashboard hanya bisa dibuka dengan menambahkan /admin di belakang URL, misalnya domain.com/admin. Tidak ada tautan ke sana dari situs publik.
Semua rute /admin/* wajib login, kecuali /admin/login.
Hanya akun owner dan admin yang bisa login. Tidak ada registrasi publik. Akun dibuat oleh Owner di halaman Akun. "Lupa kata sandi" tidak self-service: tampilkan teks "Lupa kata sandi? Hubungi Owner."
Semua halaman /admin/* berstatus noindex, nofollow, dan tidak masuk sitemap.ts.
3.2 Akun dummy (tersimpan di lib/admin/mock/users.ts)
Peran	Email	Kata sandi
owner	owner@mieayam.test	Owner123!
admin	admin@mieayam.test	Admin123!

Akun contoh ketiga berstatus nonaktif (admin2@mieayam.test) untuk menguji pesan "Akun dinonaktifkan".

3.3 Alur
Pengunjung membuka /admin tanpa sesi → dialihkan ke /admin/login?next=/admin.
Login: server action loginAction memeriksa akun dummy. Jika benar, set cookie mm_session (httpOnly, sameSite=lax, path=/, masa berlaku 8 jam) berisi base64url(JSON{uid, name, role, exp}), lalu redirect ke next (hanya diterima jika diawali /admin; tolak URL eksternal) atau /admin.
Sudah login lalu membuka /admin/login → dialihkan ke /admin.
Sesi habis → dialihkan ke login dengan pesan "Sesi berakhir, silakan masuk lagi."
Keluar: logoutAction menghapus cookie, redirect ke /admin/login.
Salah kata sandi: pesan "Email atau kata sandi salah." (jangan membedakan email tidak ditemukan dan sandi salah). Setelah 5 kali gagal berturut-turut, tombol Masuk dikunci 30 detik (simulasi di sisi klien).
3.4 Penjagaan berlapis
proxy.ts di root web/ (di Next.js ≤ 15 namanya middleware.ts; di Next.js 16 konvensi ini diganti nama menjadi proxy dengan fungsi proxy. Pakai yang sesuai versi terpasang). Matcher /admin/:path*. Tugasnya: baca dan validasi cookie (ada, belum kedaluwarsa, peran owner/admin), lalu cek canAccess(role, pathname). Peran tidak berhak → rewrite/redirect ke /admin/akses-ditolak.
Pengecekan ulang di server component app/admin/(panel)/layout.tsx (baca cookie, validasi sesi). Jangan hanya mengandalkan proxy.
Sidebar menyembunyikan menu yang tidak boleh diakses peran tersebut.
3.5 Catatan keamanan (wajib ditulis di README)

Autentikasi ini hanya simulasi: kata sandi ditulis di kode dan cookie tidak ditandatangani. Jangan dipakai untuk data sungguhan. Di fase backend, seluruh bagian ini diganti dengan login ke Core API, JWT httpOnly, hash kata sandi (bcrypt/argon2), rate limit di server, dan opsional 2FA. Logika dummy diisolasi di lib/admin/auth/ dan lib/admin/services/auth-service.ts supaya penggantiannya mudah.

Jika dideploy ke URL publik: set NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=false agar kredensial tidak ditampilkan, dan jangan memasukkan data asli apa pun.

4. Peran dan hak akses

Semua aturan ada di satu file, lib/admin/permissions.ts (routePermissions + can(role, action)), dipakai oleh proxy, sidebar, dan komponen.

Fitur	Owner	Admin
Lihat Dashboard ringkasan	✓	✓
Ubah status toko, jadwal, override	✓	✓
Ubah konten situs (profil, tentang, galeri, testimoni)	✓	✓
Ubah Kontak & Lokasi (nomor WhatsApp, alamat, peta)	✓	✗ (hanya lihat)
Tambah/ubah menu, harga, status habis, alias	✓	✓
Hapus menu	✓	✗
Chatbot: ubah template/FAQ, lihat log	✓	✓
Input pesanan dari foto, review, simpan	✓	✓
Lihat riwayat pesanan	✓	✓
Ubah/hapus pesanan yang sudah terkonfirmasi	✓	✗
Lihat dan ekspor laporan	✓	✓
Kelola akun (/admin/akun)	✓	✗
Reset data dummy	✓	✗

Aksi yang tidak diizinkan: tombolnya disembunyikan atau diganti keterangan "Hanya Owner" (pilih yang paling jelas per kasus), dan fungsi service juga menolak.

5. Tech stack tambahan

Tetap Next.js (App Router) + TypeScript + Tailwind dari Fase 1. Tambahan yang diizinkan:

react-hook-form + zod (form dan validasi)
recharts (satu-satunya library chart; wajib memakai warna token tema)
lucide-react (sudah ada)

Selain itu tanpa library UI atau animasi besar. Catatan Next.js terbaru: params, searchParams, dan cookies() bersifat asinkron (await); jalankan lint lewat skrip yang dihasilkan create-next-app (di Next.js 16 next lint sudah dihapus).

Env baru di .env.example:

NEXT_PUBLIC_DUMMY_MODE=true
NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=true
6. Struktur folder (tambahan di web/)
web/
├── proxy.ts                           # (atau middleware.ts) guard /admin/*
├── app/
│   └── admin/
│       ├── layout.tsx                 # metadata noindex, ToastProvider, DummyStoreProvider
│       ├── login/
│       │   ├── page.tsx
│       │   └── actions.ts             # loginAction, logoutAction (DUMMY)
│       └── (panel)/
│           ├── layout.tsx             # shell: Sidebar + Topbar + cek sesi & peran
│           ├── page.tsx               # /admin  ringkasan
│           ├── toko/page.tsx
│           ├── konten/page.tsx
│           ├── menu/page.tsx
│           ├── chatbot/page.tsx
│           ├── pesanan/
│           │   ├── page.tsx           # riwayat
│           │   ├── baru/page.tsx      # upload foto
│           │   └── [id]/
│           │       ├── page.tsx       # detail (foto + hasil, read-only)
│           │       └── review/page.tsx
│           ├── laporan/page.tsx
│           ├── akun/page.tsx
│           └── akses-ditolak/page.tsx
├── components/admin/
│   ├── shell/                         # Sidebar, Topbar, MobileNavDrawer, UserMenu, DemoBanner
│   ├── ui/                            # PageHeader, StatCard, DataTable, Badge, StatusPill,
│   │                                  # RoleBadge, Modal, Drawer, ConfirmDialog, Toast, Tabs,
│   │                                  # Field (Input/Select/Textarea/Switch/Stepper/TagInput),
│   │                                  # Skeleton, EmptyState, ErrorState, Dropzone,
│   │                                  # ImageViewer, Pagination, DateRangeFilter
│   └── features/                      # StatusToggleCard, HoursEditor, MenuForm,
│                                      # WhatsAppPreview, ExtractionTable, ReportCharts, UserForm
├── lib/admin/
│   ├── types.ts                       # tipe entitas dan kontrak ekstraksi
│   ├── permissions.ts
│   ├── auth/session.ts                # encode/decode cookie dummy
│   ├── mock/
│   │   ├── seed.ts                    # data awal (deterministik)
│   │   ├── store.tsx                  # provider + persistensi localStorage
│   │   └── mock-extract.ts            # simulasi hasil AI
│   └── services/                      # SATU-SATUNYA yang dipanggil UI
│       ├── auth-service.ts
│       ├── status-service.ts
│       ├── content-service.ts
│       ├── menu-service.ts
│       ├── chatbot-service.ts
│       ├── order-service.ts
│       ├── report-service.ts
│       └── user-service.ts
├── scripts/generate-dummy-notes.mjs   # buat foto catatan contoh (lihat 7.4)
└── public/images/dummy-catatan-01.jpg … -03.jpg
7. Lapisan data dummy
7.1 Prinsip
Komponen UI hanya memanggil fungsi di lib/admin/services/*. Tidak ada komponen yang membaca localStorage atau seed langsung.
Setiap fungsi service asinkron (mengembalikan Promise) dengan jeda buatan 300–700 ms, agar state loading, skeleton, dan error benar-benar teruji. Signature-nya meniru endpoint masa depan (bagian 14), sehingga nanti hanya isi fungsi yang diganti dengan fetch.
Penyimpanan: DummyStoreProvider menyimpan state di localStorage dengan kunci berversi mm_dummy_state_v1. Bungkus semua akses dengan try/catch dan tangani kasus kosong atau kuota penuh. Data tetap ada setelah reload; tombol "Reset data dummy" (Owner) mengembalikan ke seed.
7.2 Tipe inti (lib/admin/types.ts)

Cerminkan entitas: User, StoreStatus + StatusLogEntry, StoreHour, MenuItem (dengan aliases: string[]), Order + OrderItem, ExtractionJob, ChatLog, Faq, SiteContent. Dua tipe berikut adalah kontrak dengan service ML nanti, jangan diubah bentuknya:

ts
export type ExtractionItem = {
  name: string;            // nama menu hasil pencocokan (atau teks mentah bila tak cocok)
  qty: number;
  note?: string;
  confidence: number;      // 0..1
  menuItemId: number | null; // null = tidak ada di menu
};
export type ExtractionResult = { items: ExtractionItem[]; needsReview: boolean };

Status job: "diproses" | "perlu_review" | "terkonfirmasi" | "gagal". Aturan needsReview: ada item dengan confidence < 0.75 atau menuItemId === null.

7.3 Data seed (seed.ts, deterministik)

Gunakan PRNG berbenih (mis. mulberry32 dengan seed 42) agar data sama setiap kali.

Pengguna: sesuai bagian 3.2.
Menu: pakai item contoh Fase 1 beserta alias contoh (mis. ma, mie ayam biasa untuk Mie Ayam Original; pgr untuk Pangsit Goreng). Harga contoh, tandai di TODO.md.
Jadwal dan status: jam contoh Senin–Sabtu 07.00–15.00, Minggu libur; manualOverride = "none"; 6 entri log perubahan.
Pesanan: ±45 pesanan terkonfirmasi dalam 30 hari terakhir (1–6 baris item, sekitar 60% bersumber foto, sisanya manual), sebaran jam ramai realistis (siang paling padat).
Job: 2 job perlu_review (memakai dummy-catatan-01.jpg dan -02.jpg) dan 1 job gagal.
Chatbot: 1 template auto-reply, 5 FAQ, ±25 log percakapan dalam 14 hari (campuran saat buka dan tutup), nomor selalu tersamarkan (0812****34).
Semua nama, nomor, dan isi pesan jelas fiktif.
7.4 Simulasi AI
mockExtract(file) memilih satu dari 3 hasil contoh berdasarkan hash nama file. Setiap hasil memuat campuran: item yakin (≥ 0,85), item perlu dicek (0,6–0,75), dan item tidak ada di menu (menuItemId: null, confidence rendah). Contoh baris: "MA 2" → Mie Ayam Original, qty 2, 0,96; "bks tmbh" → Bakso Tambahan, qty 1, 0,58; "kerupuk??" → tidak ada di menu, 0,31.
Nama file yang mengandung gagal memicu job berstatus gagal (untuk menguji state error). Dokumentasikan di README.
scripts/generate-dummy-notes.mjs (sharp) membuat 3 gambar dummy-catatan-0X.jpg bergaya kertas bergaris dengan teks catatan ala tulisan tangan (font cursive generik), cukup sebagai contoh visual. Jalankan sekali dan commit hasilnya.
Foto yang diunggah pengguna: kompres di sisi klien (sisi terpanjang maksimal 1600 px, JPEG kualitas 0,8) lalu simpan versi kecil (maksimal sisi 1200 px) sebagai data URL di state. Jika kuota localStorage penuh, simpan hanya di memori dan tampilkan peringatan ringan. Simpan maksimal 10 foto unggahan terakhir.
8. Tema dan arah desain dashboard

Dashboard harus terasa satu keluarga dengan company profile: hangat dan ramah, tetapi fungsional dan rapi untuk bekerja. Bukan template admin generik biru/abu.

8.1 Token (pakai ulang dari Fase 1)

--merah-jago #8D0D00, --merah-tua #6B0A00, --emas #CBA857, --emas-terang #F4CE90, --emas-tua #A8783A, --krem #FFF4E0, --krem-tua #F6E4C4, --putih #FFFFFF, --cokelat #3B2416, --cokelat-muda #6B5240, --hijau-buka #2E7D32, --abu-tutup #6B5B50.

Token semantik khusus dashboard (boleh ditambah, hanya ini):

Token	Teks	Latar	Dipakai untuk
--sukses	
#276B2B	
#E4F2E5	Terkonfirmasi, berhasil, "Yakin"
--peringatan	
#8A5A00	
#FBEBC8	Perlu review, "Cek lagi"
--bahaya	
#B42318	
#FBE4E1	Error, gagal, hapus
--netral	
#6B5240	
#F6E4C4	Sedang diproses, info

Aturan: tidak ada biru atau ungu. Status tidak boleh hanya bergantung warna; selalu sertakan ikon dan teks. Kontras minimal WCAG AA.

8.2 Tipografi

Playfair Display untuk judul halaman (h1) dan angka besar pada kartu statistik; Poppins untuk semuanya. Ukuran isi dan tabel 14 px (16 px untuk input di mobile agar tidak memicu zoom iOS). Maksimal 2 keluarga font, sama seperti Fase 1.

8.3 Shell
Sidebar (desktop ≥ 1024 px, lebar 264 px, tetap): latar --merah-jago; atas: logo bulat 40 px + nama usaha (Playfair, krem); item menu Poppins 500 krem dengan ikon lucide; hover latar krem 8%; aktif: latar --merah-tua, garis kiri 3 px --emas, teks krem tebal. Judul grup (Poppins 500, 12 px, --emas-terang, huruf biasa, bukan kapital): Ringkasan, Profil & Toko, Pesanan & AI, Pengaturan (hanya Owner). Di bawah: kartu pengguna kecil + tombol Keluar.
Mobile/tablet (< 1024 px): sidebar menjadi drawer dari kiri (tombol hamburger 44×44 px di topbar), tertutup saat memilih menu atau Esc.
Topbar: latar krem dengan garis bawah tipis; kiri hamburger (mobile) dan judul halaman; kanan: chip status toko (titik + "Buka"/"Tutup", tautan ke /admin/toko), tautan "Lihat situs" (tab baru, ke /), UserMenu (avatar inisial berbingkai emas, nama, RoleBadge, "Keluar").
DemoBanner: strip tipis --emas-terang di atas topbar dengan teks "Mode demo: data contoh, tidak tersimpan ke server." Tampil selama NEXT_PUBLIC_DUMMY_MODE=true, tidak bisa ditutup.
Area konten: latar --krem, max-w-[1280px], padding 16 / 24 / 32 px. Header halaman: h1 (Playfair), deskripsi satu kalimat (--cokelat-muda), GoldDivider tipis, tombol aksi utama di kanan (mobile: di bawah judul).
8.4 Komponen
Kartu: latar putih, border 1px solid rgba(59,36,22,.08), rounded-2xl, bayangan lembut seperti Fase 1.
Tombol: pakai Button Fase 1 (red di latar terang) + varian baru danger (isi --bahaya, teks putih) dan ghost (tanpa border, teks --cokelat). Tinggi minimal 44 px.
Input: tinggi 44 px, border 1px solid rgba(59,36,22,.25), rounded-xl, label di atas, teks bantu --cokelat-muda. Fokus: cincin 3 px --merah-jago. Error: border --bahaya + ikon + pesan di bawah field.
Tabel: header latar --krem-tua, tinggi baris 52 px, hover latar krem. Di bawah 768 px, DataTable berubah menjadi daftar kartu (satu kartu per baris) pada Riwayat Pesanan, Menu, Akun, dan Log chatbot.
Badge: pill kecil dengan ikon + teks, warna dari token semantik. RoleBadge: Owner = isi --emas teks --cokelat; Admin = isi --krem-tua teks --cokelat.
StatusPill job: diproses (netral, ikon berputar), perlu_review (peringatan), terkonfirmasi (sukses), gagal (bahaya).
Toast: muncul di bawah tengah (mobile) / kanan atas (desktop), role="status", hilang otomatis 4 detik, bisa ditutup.
Modal/Drawer/ConfirmDialog: fokus terkunci di dalam, Esc menutup, fokus kembali ke pemicu. ConfirmDialog untuk aksi destruktif menyebut nama objeknya ("Hapus menu 'Es Teh Manis'?") dan memakai tombol danger.
Skeleton: blok krem-tua dengan kilau halus (nonaktif saat prefers-reduced-motion).
Motif merek: GoldDivider hanya di header halaman dan login. Jangan dipakai berlebihan.
9. Spesifikasi halaman
/admin/login
Layout dua panel (desktop): kiri latar --merah-jago berisi logo bulat besar, nama usaha, tagline, GoldDivider; kanan form di atas latar krem. Mobile: panel merah menjadi header pendek di atas form.
Form: Email, Kata sandi (dengan tombol tampilkan/sembunyikan, aria-pressed), tombol "Masuk" (lebar penuh, red). Keadaan: loading (spinner + teks "Memeriksa…"), error (pesan di atas form dengan ikon, role="alert"), terkunci (hitung mundur 30 detik).
Teks "Lupa kata sandi? Hubungi Owner." (bukan tautan). Tidak ada tombol daftar.
Jika NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=true: kotak kecil "Akun demo" berisi kedua akun dengan tombol "Isi otomatis".
Tampil pesan sesuai ?reason=expired (sesi berakhir) atau akun nonaktif.
/admin Ringkasan
Sapaan: "Halo, {nama}" + RoleBadge.
Empat StatCard: Status toko (badge besar + saklar cepat dengan konfirmasi), Pesanan hari ini (angka + selisih dibanding kemarin), Perlu review (jumlah job perlu_review, tautan ke daftar), Pesan masuk saat tutup (7 hari terakhir).
Grafik pesanan 7 hari terakhir (bar sederhana).
Tabel Pesanan terbaru (5 baris) dan daftar Aktivitas terakhir (perubahan status, pesanan disimpan, menu diubah; dengan waktu relatif).
Tombol aksi utama: "Input Pesanan Baru".
/admin/toko Status Toko (Dashboard 1)
Kartu status: status saat ini (Buka/Tutup, besar), saklar besar (minimal 64×36 px). Mengubah ke Tutup membuka dialog: alasan (pilihan: Libur, Bahan habis, Acara pribadi, Lainnya + kolom teks), estimasi buka kembali (tanggal dan jam, opsional), pratinjau pesan untuk customer.
Mode status: kontrol segmen "Ikuti jadwal | Paksa buka | Paksa tutup", dengan "sampai kapan" (opsional) dan alasan. Override yang sudah lewat waktu dianggap berakhir otomatis (sama seperti logika Fase 1).
Jadwal rutin: tabel 7 hari: saklar "Libur", input jam buka dan tutup (type="time"). Validasi: jam tutup tidak boleh sama dengan jam buka; jika tutup lebih awal dari buka, tampilkan keterangan "Dianggap melewati tengah malam". Tombol "Simpan jadwal".
Pratinjau: (a) StatusBadge seperti di situs, (b) balasan otomatis chatbot saat tutup (WhatsAppPreview).
Log perubahan: tabel (waktu, oleh, perubahan), terbaru di atas.
/admin/konten Konten Situs (Dashboard 1)
Tab: Profil usaha (nama, tagline, deskripsi), Tentang (paragraf cerita, tahun berdiri, 3 highlight), Kontak & Lokasi (WhatsApp, Instagram, alamat, URL Maps, URL embed; read-only untuk Admin), Galeri (grid foto: tambah dari file lokal dengan pratinjau, ubah teks alt, urutkan dengan tombol naik/turun, hapus), Testimoni (3 entri: nama, isi, rating opsional).
Bilah simpan melekat di bawah muncul saat ada perubahan ("Simpan perubahan" / "Batal"). Peringatan bila meninggalkan halaman dengan perubahan belum disimpan.
Validasi (zod): nomor WhatsApp diawali 62 dan hanya angka, URL valid, alt wajib untuk setiap foto.
Tautan "Lihat situs" membuka / di tab baru, dengan catatan kecil bahwa perubahan dummy belum memengaruhi situs.
/admin/menu Menu (Dashboard 1)
Bilah atas: pencarian, filter kategori (Mie Ayam, Topping/Tambahan, Minuman), tombol "Tambah Menu".
Daftar/tabel: foto kecil, nama, kategori, harga (Rp15.000), saklar "Tersedia" inline (efek langsung, toast), chip alias, aksi (Ubah; Hapus hanya Owner). Urutan diubah dengan tombol naik/turun.
Form Tambah/Ubah (Drawer di desktop, layar penuh di mobile): nama, kategori, deskripsi, harga (input rupiah), foto (pratinjau), tersedia, dan Alias/singkatan (TagInput) dengan teks bantu: "Dipakai AI untuk mengenali tulisan di catatan, mis. 'MA' untuk Mie Ayam."
Validasi: nama unik per kategori, harga bilangan bulat ≥ 0, alias tidak boleh dobel antar-menu (beri pesan menu mana yang sudah memakainya).
/admin/chatbot Chatbot (Dashboard 1)
Tab Auto-reply: editor template pesan saat tutup dengan variabel {jam_buka_kembali} dan {alasan} (tombol sisipkan variabel); pratinjau gelembung chat WhatsApp langsung di samping; pengaturan jeda balasan per nomor (menit).
Tab FAQ: daftar tanya-jawab (tambah, ubah, hapus dengan konfirmasi, saklar aktif).
Tab Log percakapan: tabel (waktu, nomor tersamarkan, pesan customer, balasan bot, status toko saat itu), filter tanggal dan "hanya saat tutup", klik baris membuka drawer berisi percakapan.
Semua data ini dummy; beri catatan kecil "Bot belum terhubung ke WhatsApp."
/admin/pesanan/baru Input Pesanan (Dashboard 2)
Dropzone: seret dan lepas, tombol "Ambil Foto" (<input type="file" accept="image/*" capture="environment">, utama di mobile) dan "Pilih File". Terima JPG/PNG/WebP/HEIC, maksimal 10 MB; pesan error jelas bila tidak sesuai.
Pratinjau foto dengan tombol putar kiri/kanan dan "Ganti foto". Panduan singkat di samping: tips memotret (terang, tegak, seluruh catatan terlihat).
Tombol "Proses dengan AI" → keadaan memproses dengan langkah bertahap ("Mengunggah foto…", "Membaca tulisan…", "Mencocokkan dengan menu…", 1,5–3 detik total) → membuat job lalu mengarahkan ke /admin/pesanan/[id]/review.
Tautan sekunder "Input manual tanpa foto" menuju review dengan tabel kosong.
/admin/pesanan/[id]/review Review Hasil (Dashboard 2)

Layar terpenting; paling dirapikan untuk HP.

Desktop: dua panel. Kiri foto asli (sticky, tombol perbesar/perkecil, klik membuka tampilan penuh). Kanan tabel hasil.
Mobile: foto di atas dalam panel yang bisa dilipat (tinggi pratinjau terbatas), tabel di bawah, dan bilah aksi melekat di bawah layar berisi total dan tombol Simpan.
Tabel hasil: kolom Teks asli (read-only, dari catatan), Menu (pilihan/pencarian dari daftar menu), Jumlah (stepper − / +, minimum 1), Catatan, Keyakinan, Hapus baris.
Keyakinan: ≥ 0,85 "Yakin" (sukses), 0,6–0,85 "Cek lagi" (peringatan), < 0,6 atau tidak cocok "Perlu dicek" / "Tidak ada di menu" (bahaya). Baris yang perlu perhatian diberi latar --peringatan muda dan ikon, dan item tanpa menu cocok wajib dipilihkan menu sebelum bisa disimpan.
Tombol "Tambah item", "Tulis ulang dari foto" (simulasi), ringkasan di atas tabel: "{n} item, {m} perlu dicek".
Kolom meta: tanggal pesanan (bawaan hari ini), sumber (Foto/Manual). Subtotal per baris dan total dihitung dari harga menu × jumlah.
Simpan pesanan nonaktif sampai tidak ada baris tidak valid. Setelah disimpan: status terkonfirmasi, toast, lalu ke detail pesanan.
Status lain: diproses menampilkan skeleton dan memperbarui otomatis; gagal menampilkan ErrorState dengan "Foto ulang" dan "Input manual". Peringatan bila meninggalkan halaman dengan perubahan belum disimpan.
/admin/pesanan Riwayat (Dashboard 2)
Filter: rentang tanggal (preset Hari ini, 7 hari, 30 hari, kustom), status (chip), pencarian nama menu.
Tabel: ID (#ORD-0001), tanggal, jumlah item, total, sumber (Foto/Manual), status, dibuat oleh. Paginasi 10 baris per halaman. Klik baris membuka /admin/pesanan/[id].
Tombol "Ekspor CSV" (membuat CSV sungguhan dari data terfilter di sisi klien).
Keadaan kosong: ikon + "Belum ada pesanan pada rentang ini." + tombol "Input Pesanan Baru".
/admin/pesanan/[id] Detail
Foto asli di samping hasil terkonfirmasi (tabel item, total), meta (waktu, oleh, sumber). Untuk Owner: tombol "Ubah" (kembali ke review) dan "Hapus" (konfirmasi). Admin: hanya lihat.
/admin/laporan Laporan (Dashboard 2)
Filter periode (preset + kustom).
Kartu KPI: Total pesanan, Total item terjual, Estimasi pendapatan (diberi label "estimasi", hitungan dari harga menu), Pesan masuk saat tutup.
Grafik: Tren pesanan harian (garis), Menu terlaris (bar horizontal, 5 teratas), Jam ramai (bar per jam), Pesan masuk saat tutup per hari. Semua dengan teks alternatif ringkasan dan warna dari token.
Tabel "Ringkasan harian" dan tombol Ekspor CSV serta Cetak (window.print() dengan gaya cetak yang menyembunyikan sidebar/topbar).
/admin/akun Akun dan Pengguna (hanya Owner)
Tabel: nama, email, RoleBadge, status (Aktif/Nonaktif), login terakhir.
Tombol "Tambah Pengguna": nama, email, peran (hanya owner atau admin), kata sandi sementara (tombol "Buat otomatis"). Aksi per pengguna: ubah peran, nonaktifkan/aktifkan, reset kata sandi (simulasi), hapus (konfirmasi).
Aturan: tidak boleh menonaktifkan atau menghapus diri sendiri maupun Owner terakhir; email harus unik; pesan error jelas.
/admin/akses-ditolak

Halaman ramah: ikon kunci, "Kamu tidak punya akses ke halaman ini", tombol "Kembali ke Ringkasan".

10. Aturan UX lintas halaman
Mobile-first. Uji di lebar 360, 390, 768, 1024, 1280 px. Tidak boleh ada scroll horizontal pada halaman (tabel lebar diganti daftar kartu, lihat 8.4). Target sentuh ≥ 44 px.
Tiga alur paling sering dipakai harus ringan di HP: ubah status toko, ambil foto lalu proses, review lalu simpan. Maksimal 3 ketukan dari Ringkasan.
Setiap aksi ada umpan balik: tombol menampilkan loading dan nonaktif saat diproses, toast saat berhasil, pesan inline saat gagal.
Tiga keadaan wajib di setiap halaman data: loading (skeleton), kosong (EmptyState dengan ajakan tindakan), dan galat (ErrorState dengan "Coba lagi").
Aksi destruktif selalu dikonfirmasi dengan menyebut nama objek. Perubahan yang belum disimpan diperingatkan sebelum pindah halaman.
Format Indonesia: tanggal 14 Nov 2026, 10.30, zona Asia/Jakarta, rupiah Rp15.000, nomor telepon tersamarkan pada log. Teks antarmuka bahasa Indonesia, santai tapi sopan, ringkas, kata kerja aktif.
Gerak: hemat (transisi drawer/modal ≤ 200 ms, kilau skeleton, titik status berdenyut). Semuanya nonaktif saat prefers-reduced-motion: reduce.
Aksesibilitas: landmark semantik, urutan heading benar, label pada semua input, fokus keyboard terlihat, fokus terkunci di modal/drawer/lightbox, aria-live untuk toast, tabel semantik, alt pada foto, kontras AA. Seluruh alur utama bisa dijalankan hanya dengan keyboard.
Konsistensi: satu pola untuk tiap hal (simpan, hapus, filter, ekspor). Jangan membuat varian baru tanpa alasan.
11. Langkah kerja (berurutan, commit per langkah)
#	Langkah	Kriteria selesai
0	Dependensi baru, token semantik, types.ts, permissions.ts, seed.ts, store.tsx, semua services, skrip foto catatan contoh (jalankan)	build lulus; data seed termuat dari localStorage/seed
1	Auth dummy: halaman login, server action, session.ts, proxy.ts, halaman akses-ditolak	Semua alur bagian 3.3 berjalan; rute terlindungi dari akses tanpa sesi
2	Shell: Sidebar, Topbar, drawer mobile, UserMenu, DemoBanner, komponen ui/ dasar (Button varian baru, Modal, Drawer, Toast, Field, DataTable, Skeleton, EmptyState, ErrorState)	Tampil benar di 390 px dan 1280 px; menu tersaring sesuai peran
3	/admin Ringkasan	Kartu, grafik, dan tabel memakai data seed
4	/admin/toko	Saklar, mode, jadwal, pratinjau, dan log berfungsi dan tersimpan
5	/admin/menu dan /admin/konten	CRUD, validasi, hak akses peran, bilah simpan
6	/admin/chatbot	Tiga tab berfungsi; pratinjau gelembung chat
7	/admin/pesanan/baru + /[id]/review + mock-extract	Alur foto → proses → review → simpan lengkap, termasuk state gagal dan peringatan perubahan
8	/admin/pesanan + /[id]	Filter, paginasi, ekspor CSV, detail dengan foto berdampingan
9	/admin/laporan	Grafik, KPI, ekspor CSV, cetak
10	/admin/akun	Aturan Owner terakhir dan diri sendiri berfungsi
11	Polesan: aksesibilitas, responsif, uji keyboard, TODO.md, README (cara menjalankan, akun demo, catatan keamanan bagian 3.5, cara memicu job gagal)	Semua poin Definition of done terpenuhi