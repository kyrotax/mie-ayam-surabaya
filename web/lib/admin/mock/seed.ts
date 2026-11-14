import {
  User,
  StoreStatus,
  StatusLogEntry,
  StoreHour,
  MenuItem,
  Order,
  OrderItem,
  ExtractionJob,
  ChatLog,
  Faq,
  AutoReplyTemplate,
  SiteContent,
} from "../types";
import { INITIAL_DUMMY_USERS } from "./users";

// Deterministic PRNG: Mulberry32
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 1,
    name: "Mie Ayam Original",
    category: "Mie Ayam",
    description: "Mie kenyal dengan topping potongan ayam berbumbu manis gurih khas oriental, sawi hijau, dan kuah kaldu harum.",
    price: 20000,
    isAvailable: true,
    aliases: ["ma", "mie ayam", "mie ayam biasa", "mie biasa", "mie ori"],
    imageUrl: "/images/menu/mie-ayam.png",
    order: 1,
  },
  {
    id: 2,
    name: "Mie Ayam Pangsit",
    category: "Mie Ayam",
    description: "Mie ayam gurih dengan pangsit rebus lembut dan pangsit goreng renyah.",
    price: 25000,
    isAvailable: true,
    aliases: ["map", "mie pangsit", "pgr", "pangsit", "mie ayam pangsit"],
    imageUrl: "/images/menu/mie-pangsit.png",
    order: 2,
  },
  {
    id: 3,
    name: "Mie Ayam Bakso",
    category: "Mie Ayam",
    description: "Mie ayam oriental dengan 2 butir bakso sapi kenyal berdaging gurih.",
    price: 25000,
    isAvailable: true,
    aliases: ["mab", "mie bakso", "bakso", "mie ayam bakso", "bks"],
    imageUrl: "/images/menu/mie-bakso.png",
    order: 3,
  },
  {
    id: 4,
    name: "Mie Ayam Komplit",
    category: "Mie Ayam",
    description: "Pilihan paling favorit: mie ayam dengan topping ayam melimpah, bakso sapi, dan pangsit renyah.",
    price: 30000,
    isAvailable: true,
    aliases: ["mak", "komplit", "mie komplit", "mie ayam komplit"],
    imageUrl: "/images/menu/mie-komplit.png",
    order: 4,
  },
  {
    id: 5,
    name: "Bakso Sapi Tambahan",
    category: "Topping/Tambahan",
    description: "Porsi ekstra bakso sapi kuah gurih (isi 3 butir).",
    price: 10000,
    isAvailable: true,
    aliases: ["bks tmbh", "tambah bakso", "ekstra bakso", "bakso porsi"],
    imageUrl: "/images/menu/kuah-kaldu.png",
    order: 5,
  },
  {
    id: 6,
    name: "Pangsit Goreng",
    category: "Topping/Tambahan",
    description: "Pangsit renyah gurih isi olahan daging ayam (isi 4).",
    price: 10000,
    isAvailable: true,
    aliases: ["pangsit goreng", "pangsit renyah", "pgr porsi"],
    imageUrl: "/images/menu/pangsit-kuah.png",
    order: 6,
  },
  {
    id: 7,
    name: "Es Teh Manis",
    category: "Minuman",
    description: "Teh melati seduh segar dengan es batu dingin menyegarkan.",
    price: 5000,
    isAvailable: true,
    aliases: ["es teh", "esteh", "teh es", "teh manis dingin"],
    imageUrl: "/images/menu/es-teh.png",
    order: 7,
  },
  {
    id: 8,
    name: "Teh Hangat",
    category: "Minuman",
    description: "Teh melati hangat harum wangi dengan gula alami.",
    price: 5000,
    isAvailable: true,
    aliases: ["teh hangat", "teh panas", "teh tubruk"],
    imageUrl: "/images/menu/teh-hangat.jpg",
    order: 8,
  },
  {
    id: 9,
    name: "Es Teler Istimewa",
    category: "Minuman",
    description: "Es teler segar dengan alpukat mentega, kelapa muda, nangka, dan susu kental manis.",
    price: 15000,
    isAvailable: true,
    aliases: ["es teler", "teler", "esteler"],
    imageUrl: "/images/menu/es-teler.jpg",
    order: 9,
  },
];

export const INITIAL_STORE_STATUS: StoreStatus = {
  isOpen: true,
  manualOverride: "none",
  statusNote: "Warung sedang buka. Melayani santap di tempat, bawa pulang, dan pesanan WhatsApp.",
  nextOpenText: "Buka setiap hari pukul 09.00 sampai 21.00 WIB",
  updatedAt: "2026-11-14T08:00:00.000Z",
};

export const INITIAL_STATUS_LOGS: StatusLogEntry[] = [
  {
    id: "log_1",
    timestamp: "2026-11-14T08:00:00.000Z",
    actorName: "H. Bambang (Owner)",
    action: "Buka Toko",
    note: "Buka sesuai jam operasional harian.",
  },
  {
    id: "log_2",
    timestamp: "2026-11-13T21:15:00.000Z",
    actorName: "Siti Rahma (Admin)",
    action: "Tutup Toko",
    note: "Tutup reguler malam.",
  },
  {
    id: "log_3",
    timestamp: "2026-11-13T09:00:00.000Z",
    actorName: "Siti Rahma (Admin)",
    action: "Buka Toko",
    note: "Persiapan stok mie pagi lengkap.",
  },
  {
    id: "log_4",
    timestamp: "2026-11-12T15:30:00.000Z",
    actorName: "H. Bambang (Owner)",
    action: "Paksa Tutup Sementara",
    note: "Bahan kuah kaldu habis mendadak karena ramai orderan siang.",
  },
  {
    id: "log_5",
    timestamp: "2026-11-12T16:30:00.000Z",
    actorName: "H. Bambang (Owner)",
    action: "Buka Kembali",
    note: "Stok kaldu tambahan sudah siap.",
  },
  {
    id: "log_6",
    timestamp: "2026-11-11T21:00:00.000Z",
    actorName: "Siti Rahma (Admin)",
    action: "Tutup Toko",
    note: "Tutup reguler.",
  },
];

export const INITIAL_HOURS: StoreHour[] = [
  { dayOfWeek: 1, dayName: "Senin", openTime: "09:00", closeTime: "21:00", isClosed: false },
  { dayOfWeek: 2, dayName: "Selasa", openTime: "09:00", closeTime: "21:00", isClosed: false },
  { dayOfWeek: 3, dayName: "Rabu", openTime: "09:00", closeTime: "21:00", isClosed: false },
  { dayOfWeek: 4, dayName: "Kamis", openTime: "09:00", closeTime: "21:00", isClosed: false },
  { dayOfWeek: 5, dayName: "Jumat", openTime: "09:00", closeTime: "21:00", isClosed: false },
  { dayOfWeek: 6, dayName: "Sabtu", openTime: "09:00", closeTime: "21:30", isClosed: false },
  { dayOfWeek: 0, dayName: "Minggu", openTime: "09:00", closeTime: "21:30", isClosed: false },
];

export const INITIAL_FAQS: Faq[] = [
  {
    id: "faq_1",
    question: "Apakah Mie Ayam Surabaya halal?",
    answer: "Ya, 100% halal. Kami menggunakan olahan daging ayam segar dan bumbu oriental halal tanpa minyak babi/arak.",
    isActive: true,
  },
  {
    id: "faq_2",
    question: "Bisa pesan antar melalui apa saja?",
    answer: "Pemesanan online bisa lewat Gojek, GrabFood, dan langsung via chat WhatsApp kami di 0823-1919-5854.",
    isActive: true,
  },
  {
    id: "faq_3",
    question: "Berapa jam operasional warung?",
    answer: "Kami buka setiap hari pukul 09.00 - 21.00 WIB (Sabtu-Minggu tutup pukul 21.30 WIB).",
    isActive: true,
  },
  {
    id: "faq_4",
    question: "Apakah tersedia tempat makan di lokasi (dine-in)?",
    answer: "Tersedia tempat makan bersih dan nyaman di Jl. Raya Taman Pinang Indah, Sidoarjo.",
    isActive: true,
  },
  {
    id: "faq_5",
    question: "Apakah bisa pesan untuk katering atau acara rombongan?",
    answer: "Bisa, silakan hubungi WhatsApp kami minimal H-1 untuk pesanan rombongan lebih dari 20 porsi.",
    isActive: true,
  },
];

export const INITIAL_AUTOREPLY: AutoReplyTemplate = {
  message:
    "Halo! Terima kasih telah menghubungi Mie Ayam Surabaya.\n\nSaat ini warung kami sedang tutup ({alasan}). Kami akan buka kembali pada {jam_buka_kembali}.\n\nSilakan tinggalkan pesan Anda, kami akan segera merespons begitu operasional kembali buka. Salam hangat!",
  cooldownMinutes: 15,
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  storeName: "Mie Ayam Surabaya",
  tagline: "Cita Rasa Khas Mie Ayam Oriental di Surabaya & Sidoarjo",
  description:
    "Mie Ayam Surabaya menyajikan mie ayam bergaya oriental dengan bumbu khas dan topping melimpah. Menghadirkan kenikmatan mie otentik untuk semua kalangan.",
  story:
    "Mie Ayam Surabaya merupakan UMKM kuliner yang menyajikan mie ayam bergaya oriental, sehingga memiliki cita rasa khas yang berbeda dari mie ayam pada umumnya. Berawal dari kecintaan terhadap tekstur mie kenyal dan aroma minyak wijen serta bumbu oriental gurih, kami terus melayani pelanggan setia di Sidoarjo dan sekitarnya.",
  establishedYear: 2021,
  highlights: [
    "Topping ayam potongan dadu melimpah & bumbu meresap",
    "Mie segar diproduksi higienis setiap hari",
    "Kuah kaldu sari ayam gurih kaya rempah alami",
  ],
  whatsapp: "6282319195854",
  instagram: "https://www.instagram.com/mieayamsurabaya_/",
  address: "Jl. Raya Taman Pinang Indah, Jetis, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213",
  mapsUrl:
    "https://www.google.com/maps/place/MIE+AYAM+SURABAYA,+Jl.+Raya+Taman+Pinang+Indah,+Jetis,+Lemahputro,+Kec.+Sidoarjo,+Kabupaten+Sidoarjo,+Jawa+Timur+61213/data=!4m2!3m1!1s0x2dd7e1704b5593cd:0x81c8774cf4076883!18m1!1e1",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=MIE%20AYAM%20SURABAYA%20Taman%20Pinang%20Indah%20Sidoarjo&t=&z=15&ie=UTF8&iwloc=&output=embed",
  gallery: [
    { id: "g1", url: "/images/fotomie.png", alt: "Semangkuk Mie Ayam Komplit", order: 1 },
    { id: "g2", url: "/images/menu/mie-pangsit.png", alt: "Mie Ayam Pangsit Rebus & Goreng", order: 2 },
    { id: "g3", url: "/images/menu/mie-bakso.png", alt: "Mie Ayam Bakso Sapi Kuah Kaldu", order: 3 },
    { id: "g4", url: "/images/menu/es-teler.jpg", alt: "Es Teler Segar Kaya Buah", order: 4 },
  ],
  testimonials: [
    {
      id: "t1",
      name: "Bambang Wijaya",
      content: "Kuah kaldunya harum banget, ayamnya melimpah gak pelit. Favorit keluarga kalau lagi lewat Taman Pinang!",
      rating: 5,
    },
    {
      id: "t2",
      name: "Dian Sastro P.",
      content: "Mie kenyalnya pas, rasa oriental khas banget. Pangsit gorengnya garing kriuk gurih!",
      rating: 5,
    },
    {
      id: "t3",
      name: "Rizky Firmansyah",
      content: "Porsi kenyang, harga ramah di kantong mahasiswa & keluarga. Es telernya mantap!",
      rating: 5,
    },
  ],
};

export const INITIAL_EXTRACTION_JOBS: ExtractionJob[] = [
  {
    id: "job_01",
    createdAt: "2026-11-14T10:45:00.000Z",
    status: "perlu_review",
    photoUrl: "/images/dummy-catatan-01.jpg",
    result: {
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
          confidence: 0.68,
          menuItemId: 5,
          note: "",
        },
        {
          name: "Es Teh Manis",
          qty: 2,
          confidence: 0.92,
          menuItemId: 7,
          note: "manis sedang",
        },
        {
          name: "kerupuk kaleng putih",
          qty: 2,
          confidence: 0.35,
          menuItemId: null,
          note: "perlu dicek",
        },
      ],
    },
  },
  {
    id: "job_02",
    createdAt: "2026-11-14T11:20:00.000Z",
    status: "perlu_review",
    photoUrl: "/images/dummy-catatan-02.jpg",
    result: {
      needsReview: true,
      items: [
        {
          name: "Mie Ayam Komplit",
          qty: 3,
          confidence: 0.89,
          menuItemId: 4,
          note: "pedas sedang",
        },
        {
          name: "Es Teler Istimewa",
          qty: 2,
          confidence: 0.72,
          menuItemId: 9,
          note: "tanpa nangka",
        },
      ],
    },
  },
  {
    id: "job_03",
    createdAt: "2026-11-14T09:15:00.000Z",
    status: "gagal",
    photoUrl: "/images/dummy-catatan-03.jpg",
    errorMessage: "Foto terlalu buram dan bayangan gelap menutupi tulisan catatan. Silakan ambil foto ulang dengan pencahayaan terang.",
  },
];

// Generator Pesanan & Chat Logs Deterministik (Seed 42)
export function generateSeedData() {
  const rng = mulberry32(42);

  // Buat 45 pesanan dalam 30 hari terakhir
  const orders: Order[] = [];
  const now = new Date("2026-11-14T17:00:00.000Z").getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 45; i >= 1; i--) {
    const daysAgo = Math.floor(rng() * 29);
    // Jam realistis: 11.00 - 20.00 (puncak 12.00 - 14.00)
    let hour = 11 + Math.floor(rng() * 9);
    if (rng() > 0.4) {
      hour = 12 + Math.floor(rng() * 2); // Siang paling padat
    }
    const minute = Math.floor(rng() * 60);
    const orderDate = new Date(now - daysAgo * dayMs);
    orderDate.setUTCHours(hour, minute, 0, 0);

    const isPhoto = rng() < 0.6;
    const itemCount = 1 + Math.floor(rng() * 4);
    const items: OrderItem[] = [];
    let orderTotal = 0;

    for (let k = 0; k < itemCount; k++) {
      const menuIdx = Math.floor(rng() * INITIAL_MENU.length);
      const menu = INITIAL_MENU[menuIdx];
      const qty = 1 + Math.floor(rng() * 3);
      const itemPrice = menu.price;
      orderTotal += itemPrice * qty;
      items.push({
        menuItemId: menu.id,
        name: menu.name,
        qty,
        price: itemPrice,
        confidence: isPhoto ? 0.75 + rng() * 0.24 : 1.0,
      });
    }

    const orderNumStr = String(46 - i).padStart(4, "0");
    orders.push({
      id: `ord_${orderNumStr}`,
      orderNumber: `#ORD-${orderNumStr}`,
      createdAt: orderDate.toISOString(),
      items,
      total: orderTotal,
      source: isPhoto ? "foto" : "manual",
      status: "terkonfirmasi",
      createdBy: isPhoto ? "Siti Rahma (Admin Kasir)" : "H. Bambang (Owner)",
      photoUrl: isPhoto ? (rng() > 0.5 ? "/images/dummy-catatan-01.jpg" : "/images/dummy-catatan-02.jpg") : undefined,
    });
  }

  // Sort orders descending by createdAt
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Buat 25 log percakapan dalam 14 hari
  const chatLogs: ChatLog[] = [];
  const sampleCustomerQuestions = [
    "Halo min, apakah warung masih buka malam ini?",
    "Porsi mie ayam komplit ready berapa bungkus?",
    "Bisa minta kirim 4 porsi ke perumahan sebelah?",
    "Apakah buka hari Minggu besok?",
    "Ada bakso kuah terpisah?",
    "Pangsit gorengnya masih ada kah?",
    "Bisa booking meja buat 6 orang jam 1 siang?",
  ];

  for (let i = 25; i >= 1; i--) {
    const daysAgo = Math.floor(rng() * 14);
    const isClosedHour = rng() > 0.55;
    const hour = isClosedHour ? (rng() > 0.5 ? 22 : 6) : 10 + Math.floor(rng() * 9);
    const minute = Math.floor(rng() * 60);
    const chatDate = new Date(now - daysAgo * dayMs);
    chatDate.setUTCHours(hour, minute, 0, 0);

    const phoneMiddle = Math.floor(1000 + rng() * 9000);
    const phoneSuffix = Math.floor(10 + rng() * 90);
    const maskedPhone = `0812****${phoneSuffix}`;
    const qIdx = Math.floor(rng() * sampleCustomerQuestions.length);
    const question = sampleCustomerQuestions[qIdx];

    const botReply = isClosedHour
      ? "Halo! Saat ini warung kami sedang tutup (Libur/Luar Jam Kerja). Kami buka kembali pukul 09.00 WIB. Pesan Anda akan dibalas admin segera."
      : "Halo! Warung sedang buka dan melayani pesanan. Silakan sebutkan pesanan Anda atau order lewat Gojek/GrabFood.";

    chatLogs.push({
      id: `chat_${i}`,
      timestamp: chatDate.toISOString(),
      customerPhone: maskedPhone,
      customerMessage: question,
      botReply,
      storeStatusAtTime: isClosedHour ? "tutup" : "buka",
    });
  }

  chatLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    users: INITIAL_DUMMY_USERS,
    menu: INITIAL_MENU,
    storeStatus: INITIAL_STORE_STATUS,
    statusLogs: INITIAL_STATUS_LOGS,
    hours: INITIAL_HOURS,
    faqs: INITIAL_FAQS,
    autoReply: INITIAL_AUTOREPLY,
    siteContent: INITIAL_SITE_CONTENT,
    extractionJobs: INITIAL_EXTRACTION_JOBS,
    orders,
    chatLogs,
  };
}
