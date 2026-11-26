import { SiteConfig } from "@/types/site";

export const siteConfig: SiteConfig = {
  brandName: "Mie Ayam Surabaya",
  tagline: "Mie Ayam Oriental Khas Sidoarjo. Mienya Kenyal, Bumbunya Gurih Meresap, Porsinya Bikin Puas!",
  tahunBerdiri: "2024",
  statusBuka: true,
  statusBukaNote: "Yuk mampir atau pesan antar!",

  // Kontak & alamat warung
  kontak: {
    wa: "6282319195854",
    waDisplay: "0823-1919-5854",
    email: "kontak@mieayamsurabaya.id",
    alamat: "Jl. Raya Taman Pinang Indah, Jetis, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213",
    mapsLink: "https://www.google.com/maps/place/MIE+AYAM+SURABAYA,+Jl.+Raya+Taman+Pinang+Indah,+Jetis,+Lemahputro,+Kec.+Sidoarjo,+Kabupaten+Sidoarjo,+Jawa+Timur+61213/data=!4m2!3m1!1s0x2dd7e1704b5593cd:0x81c8774cf4076883!18m1!1e1",
    mapsEmbedUrl: "https://www.google.com/maps?q=MIE+AYAM+SURABAYA+Taman+Pinang+Indah+Sidoarjo&output=embed",
  },

  // Media sosial
  sosmed: {
    ig: "@mieayamsurabaya_",
    igUrl: "https://www.instagram.com/mieayamsurabaya_/",
    tiktok: "@mieayamsurabaya",
    tiktokUrl: "https://www.tiktok.com/@mieayamsurabaya",
    maps: "https://www.google.com/maps/place/MIE+AYAM+SURABAYA",
  },

  // Menu Makanan (termasuk Mie Ayam original)
  menuMakanan: [
    {
      id: "mie-komplit",
      nama: "Mie Ayam Komplit",
      deskripsi: "Paling lengkap dan mantap! Mie kenyal dengan topping ayam gurih melimpah, 2 butir bakso sapi kenyal, pangsit basah lembut, dan pangsit goreng renyah.",
      harga: 30000,
      foto: "/images/mie-ayam-komplit.png",
      badge: "Paling Laris",
      isAvailable: true,
      kategori: "makanan",
    },
    {
      id: "mie-ayam",
      nama: "Mie Ayam",
      deskripsi: "Varian klasik original favorit semua orang! Mie kenyal buatan sendiri dipadu potongan ayam berbumbu gurih empuk, sawi hijau segar, dan kuah kaldu hangat.",
      harga: 20000,
      foto: "/images/mie-ayam.png",
      badge: "Klasik",
      isAvailable: true,
      kategori: "makanan",
    },
    {
      id: "mie-bakso",
      nama: "Mie Ayam Bakso",
      deskripsi: "Paduan favorit mie kenyal, daging ayam bumbu gurih meresap, dan bakso sapi asli yang kenyal sedap dengan kuah kaldu hangat.",
      harga: 25000,
      foto: "/images/mie-ayam-bakso.png",
      badge: "Favorit",
      isAvailable: true,
      kategori: "makanan",
    },
    {
      id: "mie-pangsit",
      nama: "Mie Ayam Pangsit",
      deskripsi: "Renyah dan gurih! Mie ayam khas dengan taburan kulit pangsit goreng garing plus pangsit rebus lembut isi daging olahan pilihan.",
      harga: 25000,
      foto: "/images/mie-ayam-pangsit.png",
      badge: "Populer",
      isAvailable: true,
      kategori: "makanan",
    },
  ],

  // Menu Minuman (termasuk Es Teh dan Teh Hangat)
  menuMinuman: [
    {
      id: "es-teh",
      nama: "Es Teh",
      deskripsi: "Es teh manis segar dingin, pelepas dahaga paling pas sehabis menyantap semangkuk mie ayam hangat.",
      harga: 5000,
      foto: "/images/es-teh.png",
      badge: "Segar",
      isAvailable: true,
      kategori: "minuman",
    },
    {
      id: "teh-hangat",
      nama: "Teh Hangat",
      deskripsi: "Teh manis hangat dengan aroma wangi melati alami, bikin tenggorokan hangat dan perut nyaman.",
      harga: 5000,
      foto: "/images/teh-hangat.jpg",
      badge: null,
      isAvailable: true,
      kategori: "minuman",
    },
    {
      id: "es-teler",
      nama: "Es Teler",
      deskripsi: "Segar dan legit! Perpaduan potongan alpukat, nangka harum, kelapa muda, dan siraman susu manis kental.",
      harga: 20000,
      foto: "/images/es-teler.png",
      badge: "Spesial",
      isAvailable: true,
      kategori: "minuman",
    },
  ],

  // Menu unggulan untuk showcase di hero / highlight
  get menuUnggulan() {
    return [
      this.menuMakanan[0], // Mie Ayam Komplit
      this.menuMakanan[1], // Mie Ayam (ori)
      this.menuMakanan[2], // Mie Ayam Bakso
    ];
  },

  // Testimoni asli pelanggan (referensi ulasan Google Maps)
  testimoni: [
    {
      nama: "Cleo Cleo",
      teks: "Jarang kasih bintang 5, tapi yg ini memang layak. Mienya kenyal, topping ayamnya gurih & meresap, porsiny bikin kenyang. Dengan harga segini, rasanya benar-benar di atas ekspektasi. Salah satu mie ayam terenak di Surabaya & Sidoarjo 👍 Highly recommended!",
      rating: 5
    },
    {
      nama: "Daniel Abraham",
      teks: "enakk bgt mie nyaa tuhh nge chinese bgt mah klo kata akuu, suka bgt enakkk bakal langganan sini sii klo habis plg dr gms😍😍",
      rating: 5,
    },
    {
      nama: "Nico Chiarouven",
      teks: "Mienya enak, teksturnya kenyal dan bumbunya pas. Toppingnya juga melimpah dengan porsi yang mengenyangkan. Tempatnya bersih, pelayanan cepat, dan harganya masih terjangkau. Cocok buat makan sendiri maupun bersama keluarga. Pasti akan kembali lagi. Recommended!",
      rating: 5,
    },
    {
      nama: "Satyananda Gunawan",
      teks: "Dari tampilan aja uda bikin ngiler apalagi pas di coba,haujek secimping westalah pokoke",
      rating: 5,
    },
  ],

  // Galeri foto hidangan & suasana warung autentik
  galeri: [
    {
      src: "/images/1.png",
      alt: "Suasana Warung Mie Ayam Surabaya",
      caption: "Suasana Warung Hangat",
    },
    {
      src: "/images/mie-ayam-komplit.png",
      alt: "Semangkuk Mie Komplit Oriental dengan topping melimpah",
      caption: "Mie Ayam Komplit Spesial",
    },
    {
      src: "/images/2.png",
      alt: "Area makan warung yang bersih dan nyaman",
      caption: "Tempat Bersih & Nyaman",
    },
    {
      src: "/images/mie-ayam-bakso.png",
      alt: "Mie Ayam Bakso kuah kaldu hangat",
      caption: "Mie Ayam Bakso Sapi",
    },
    {
      src: "/images/3.png",
      alt: "Tampak depan warung Mie Ayam Surabaya",
      caption: "Tampak Warung di Taman Pinang",
    },
    {
      src: "/images/mie-ayam-pangsit.png",
      alt: "Mie Ayam Pangsit renyah oriental",
      caption: "Mie Ayam Pangsit Renyah",
    },
    {
      src: "/images/es-teler.png",
      alt: "Es Teler segar manis legit",
      caption: "Es Teler Segar",
    },
  ],

  // Copywriting tiap section (bahasa ramah, santai, hangat, dan komunikatif)
  copy: {
    hero: {
      eyebrow: "Autentik & Fresh Setiap Hari",
      heading: "Mie Ayam",
      headingAccent: "Surabaya",
      subteks: "Mie kenyal buatan sendiri tiap pagi, topping ayam gurih melimpah, dan kuah kaldu sapi hangat yang sedap. Pas banget buat makan bareng teman dan keluarga!",
      ctaMenu: "Lihat Menu Lengkap",
      ctaWa: "Pesan via WhatsApp",
    },
    tentang: {
      eyebrow: "Cerita Hangat Kami",
      heading: "Kenapa Harus Coba",
      headingAccent: "Mie Ayam Kami?",
      p1: "Bagi kami, semangkuk mie yang enak kuncinya ada di kesegaran bahan. Setiap pagi kami membuat mie sendiri dari adonan segar tanpa bahan pengawet, sehingga tekstur kenyalnya pas, lembut di lidah, dan selalu fresh saat disajikan ke meja kamu.",
      p2: "Dipadukan dengan potongan ayam berbumbu gurih manis yang meresap sempurna, kuah kaldu sapi hangat rebusan berjam-jam, serta pangsit renyah buatan dapur kami. Warung kami di Taman Pinang Indah siap menyambut santap siang dan malammu bareng keluarga serta sahabat.",
      badgeText: "MIE AYAM SURABAYA · SEJAK 2024 ·",
      foto: "/images/1.png",
    },
    kenapaPilihKami: {
      eyebrow: "Kelebihan Warung Kami",
      heading: "Kenapa Banyak yang",
      headingAccent: "Suka & Langganan?",
      items: [
        {
          judul: "Bumbu Ayam Meresap",
          deskripsi: "Potongan ayam dimasak pelan dengan bumbu rempah pilihan sampai rasa gurih manisnya meresap sampai ke serat daging.",
          icon: "bowl",
        },
        {
          judul: "Mie Fresh Buatan Sendiri",
          deskripsi: "Dibuat langsung setiap pagi tanpa bahan pengawet. Teksturnya kenyal pas, lembut alami, dan nggak gampang lembek.",
          icon: "flame",
        },
        {
          judul: "100% Halal & Bersih",
          deskripsi: "Semua bahan dijamin halal dan higienis. Dimasak di dapur bersih dengan porsi mantap yang bikin kenyang bahagia.",
          icon: "shield",
        },
      ],
    },
    menu: {
      eyebrow: "Pilihan Sajian Lezat",
      heading: "Menu Makanan",
      headingAccent: "Paling Favorit",
      subheading: "Pilih menu kesukaanmu! Semuanya disajikan hangat dengan kuah kaldu sapi sedap, sawi hijau segar, dan bumbu ayam yang melimpah.",
    },
    galeri: {
      eyebrow: "Galeri Foto Asli",
      heading: "Porsi Asli",
      headingAccent: "Langsung Dari Dapur",
      subheading: "Intip porsi lezat yang siap tersaji di mejamu saat mampir ke warung kami. Porsi puas dan rasanya mantap!",
    },
    testimoni: {
      eyebrow: "Kata Pelanggan",
      heading: "Apa Kata Teman-Teman",
      headingAccent: "Yang Sudah Mampir?",
      subheading: "Ulasan jujur dan hangat dari para pelanggan serta warga sekitar yang sudah mencicipi mie kami.",
    },
    lokasi: {
      eyebrow: "Arah & Lokasi",
      heading: "Yuk Mampir",
      headingAccent: "Ke Warung Kami!",
      subheading: "Lokasi kami mudah dijangkau di kawasan Taman Pinang Indah, Sidoarjo. Tempatnya bersih, nyaman, dan parkiran luas buat motor maupun mobil.",
      badgeNavigasi: "PANDUAN · RUTE · MAPS ·",
    },
    cta: {
      heading: "Lapar atau Pengen yang Gurih?",
      headingAccent: "Yuk, Langsung Pesan Sekarang!",
      subteks: "Mau makan langsung di tempat, bungkus bawa pulang, atau pesan antar ke rumah? Langsung klik tombol di bawah dan chat kami via WhatsApp ya!",
      tombolText: "Pesan via WhatsApp Sekarang",
    },
  },
};
