export interface JamBukaItem {
  hari: string;
  buka: string;
  tutup: string;
  libur?: boolean;
}

export interface MenuItem {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  foto: string;
  badge?: string | null;
  isAvailable?: boolean;
  kategori?: "makanan" | "minuman";
}

export interface TestimoniItem {
  nama: string;
  teks: string;
  rating: number;
  asal?: string;
}

export interface KeunggulanItem {
  judul: string;
  deskripsi: string;
  icon: "bowl" | "flame" | "shield" | "heart";
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  tahunBerdiri: string;
  statusBuka: boolean;
  statusBukaNote?: string;
  jamBuka?: JamBukaItem[];
  kontak: {
    wa: string;
    waDisplay: string;
    email: string;
    alamat: string;
    mapsLink: string;
    mapsEmbedUrl: string;
    gofoodUrl?: string;
  };
  sosmed: {
    ig: string;
    igUrl: string;
    tiktok: string;
    tiktokUrl: string;
    maps: string;
    gofoodUrl?: string;
  };
  menuMakanan: MenuItem[];
  menuMinuman: MenuItem[];
  menuUnggulan: MenuItem[];
  testimoni: TestimoniItem[];
  galeri: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  copy: {
    hero: {
      eyebrow: string;
      heading: string;
      headingAccent: string;
      subteks: string;
      ctaMenu: string;
      ctaWa: string;
    };
    tentang: {
      eyebrow: string;
      heading: string;
      headingAccent: string;
      p1: string;
      p2: string;
      badgeText?: string;
      foto: string;
    };
    kenapaPilihKami: {
      eyebrow: string;
      heading: string;
      headingAccent: string;
      items: KeunggulanItem[];
    };
    menu: {
      eyebrow: string;
      heading: string;
      headingAccent: string;
      subheading: string;
    };
    galeri: {
      eyebrow: string;
      heading: string;
      headingAccent: string;
      subheading: string;
    };
    testimoni: {
      eyebrow: string;
      heading: string;
      headingAccent: string;
      subheading: string;
    };
    lokasi: {
      eyebrow: string;
      heading: string;
      headingAccent: string;
      subheading: string;
      badgeNavigasi: string;
    };
    cta: {
      heading: string;
      headingAccent: string;
      subteks: string;
      tombolText: string;
    };
  };
}
