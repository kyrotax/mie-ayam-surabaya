const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Store Profile
  await prisma.storeProfile.upsert({
    where: { id: 1 },
    update: {
      heroImageUrl: "/images/fotomie.png",
      logoUrl: "/images/logo.jpg",
    },
    create: {
      id: 1,
      name: "Mie Ayam Surabaya",
      tagline: "Cita Rasa Khas Mie Ayam Oriental di Surabaya & Sidoarjo",
      shortDescription:
        "Mie Ayam Surabaya menyajikan mie ayam bergaya oriental dengan bumbu khas dan topping melimpah. Menghadirkan kenikmatan mie otentik untuk semua kalangan.",
      story:
        "Mie Ayam Surabaya merupakan UMKM kuliner yang menyajikan mie ayam bergaya oriental, sehingga memiliki cita rasa khas yang berbeda dari mie ayam pada umumnya. Dengan target pasar masyarakat umum dan semua kalangan, promosi dilakukan melalui TikTok dan Instagram dengan mencantumkan nomor WhatsApp Business di media sosial tersebut. Pemesanan produk dapat dilakukan secara online melalui platform Gojek dan WhatsApp. Selain memproses pemesanan, nomor WhatsApp operasional tersebut juga difungsikan untuk melayani pertanyaan pelanggan, khususnya terkait informasi jam operasional toko.",
      address:
        "Jl. Raya Taman Pinang Indah, Jetis, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213",
      mapsUrl:
        "https://www.google.com/maps/place/MIE+AYAM+SURABAYA,+Jl.+Raya+Taman+Pinang+Indah,+Jetis,+Lemahputro,+Kec.+Sidoarjo,+Kabupaten+Sidoarjo,+Jawa+Timur+61213/data=!4m2!3m1!1s0x2dd7e1704b5593cd:0x81c8774cf4076883!18m1!1e1",
      mapsEmbedUrl:
        "https://maps.google.com/maps?q=MIE%20AYAM%20SURABAYA%20Taman%20Pinang%20Indah%20Sidoarjo&t=&z=15&ie=UTF8&iwloc=&output=embed",
      whatsappNumber: "6282319195854",
      instagramUrl: "https://www.instagram.com/mieayamsurabaya_/",
      logoUrl: "/images/logo.jpg",
      heroImageUrl: "/images/fotomie.png",
    },
  });

  // 2. Store Status
  await prisma.storeStatus.upsert({
    where: { id: 1 },
    update: {
      isOpen: true,
      manualOverride: true,
      statusNote: "Warung sedang buka. Melayani santap di tempat, bawa pulang, dan pesanan WhatsApp.",
      nextOpenText: "Buka setiap hari pukul 09.00 sampai 21.00 WIB",
    },
    create: {
      id: 1,
      isOpen: true,
      manualOverride: true,
      statusNote: "Warung sedang buka. Melayani santap di tempat, bawa pulang, dan pesanan WhatsApp.",
      nextOpenText: "Buka setiap hari pukul 09.00 sampai 21.00 WIB",
    },
  });

  // 3. Operating Schedule
  const days = [
    { name: "Senin", day: 1 },
    { name: "Selasa", day: 2 },
    { name: "Rabu", day: 3 },
    { name: "Kamis", day: 4 },
    { name: "Jumat", day: 5 },
    { name: "Sabtu", day: 6 },
    { name: "Minggu", day: 0 },
  ];

  await prisma.operatingSchedule.deleteMany({});
  for (const d of days) {
    await prisma.operatingSchedule.create({
      data: {
        dayName: d.name,
        dayOfWeek: d.day,
        openTime: "09:00",
        closeTime: "21:00",
        isClosed: false,
      },
    });
  }

  // 4. Categories & Menu Items with Dummy Photo Assets
  await prisma.menuItem.deleteMany({});
  await prisma.menuCategory.deleteMany({});

  const catMakanan = await prisma.menuCategory.create({
    data: {
      name: "Makanan",
      slug: "makanan",
      order: 1,
    },
  });

  const catMinuman = await prisma.menuCategory.create({
    data: {
      name: "Minuman",
      slug: "minuman",
      order: 2,
    },
  });

  const menuData = [
    {
      categoryId: catMakanan.id,
      name: "Mie Ayam",
      price: 20000,
      description: "Mie kenyal gurih dengan olahan ayam cincang bumbu oriental khas dan sayuran segar pilihan.",
      badge: "Klasik",
      imageUrl: "/images/menu/mie-ayam.png",
      isFeatured: false,
      isAvailable: true,
      order: 1,
    },
    {
      categoryId: catMakanan.id,
      name: "Mie Ayam Pangsit",
      price: 25000,
      description: "Mie ayam bumbu oriental gurih disajikan dengan pangsit renyah dan lembut isi olahan daging lezat.",
      badge: "Favorit",
      imageUrl: "/images/menu/mie-pangsit.png",
      isFeatured: true,
      isAvailable: true,
      order: 2,
    },
    {
      categoryId: catMakanan.id,
      name: "Mie Ayam Bakso",
      price: 25000,
      description: "Paduan mie ayam khas dengan bakso sapi kenyal gurih serta siraman kuah kaldu hangat menggugah selera.",
      badge: "Populer",
      imageUrl: "/images/menu/kuah-kaldu.png",
      isFeatured: true,
      isAvailable: true,
      order: 3,
    },
    {
      categoryId: catMakanan.id,
      name: "Mie Ayam Komplit",
      price: 30000,
      description: "Paket terlengkap dan paling puas: mie ayam bumbu oriental dengan topping ayam melimpah, bakso sapi kenyal, dan pangsit istimewa.",
      badge: "Best Seller",
      imageUrl: "/images/menu/mie-komplit.png",
      isFeatured: true,
      isAvailable: true,
      order: 4,
    },
    {
      categoryId: catMinuman.id,
      name: "Es Teh",
      price: 5000,
      description: "Es teh manis segar dingin yang pas membasahi kerongkongan setelah menikmati semangkuk mie ayam hangat.",
      badge: null,
      imageUrl: "/images/menu/es-teh.jpg",
      isFeatured: false,
      isAvailable: true,
      order: 5,
    },
    {
      categoryId: catMinuman.id,
      name: "Teh Hangat",
      price: 5000,
      description: "Teh manis hangat dengan aroma daun teh melati pilihan yang menenangkan.",
      badge: null,
      imageUrl: "/images/menu/teh-hangat.jpg",
      isFeatured: false,
      isAvailable: true,
      order: 6,
    },
    {
      categoryId: catMinuman.id,
      name: "Es Teler",
      price: 15000,
      description: "Minuman penutup legendaris dengan kombinasi alpukat, nangka, kelapa muda, dan guyuran susu manis kental yang segar maksimal.",
      badge: "Rekomendasi",
      imageUrl: "/images/menu/es-teler.jpg",
      isFeatured: true,
      isAvailable: true,
      order: 7,
    },
  ];

  for (const item of menuData) {
    await prisma.menuItem.create({ data: item });
  }

  // 5. Gallery (Empty - no artificial gallery section per user instruction)
  await prisma.galleryImage.deleteMany({});

  console.log("Database seeded successfully with aesthetic menu photo assets!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
