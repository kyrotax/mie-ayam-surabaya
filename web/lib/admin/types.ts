export type Role = "owner" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
  lastLogin?: string;
  password?: string;
};

export type StoreStatus = {
  isOpen: boolean;
  manualOverride: "none" | "force_open" | "force_closed";
  overrideUntil?: string;
  overrideReason?: string;
  statusNote?: string;
  nextOpenText?: string;
  updatedAt: string;
};

export type StatusLogEntry = {
  id: string;
  timestamp: string;
  actorName: string;
  action: string;
  note?: string;
};

export type StoreHour = {
  dayOfWeek: number; // 0 = Minggu, 1 = Senin, ...
  dayName: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export type MenuCategoryType = "Mie Ayam" | "Topping/Tambahan" | "Minuman";

export type MenuItem = {
  id: number;
  name: string;
  category: MenuCategoryType;
  description?: string;
  price: number;
  isAvailable: boolean;
  aliases: string[];
  imageUrl?: string;
  order: number;
};

export type OrderItem = {
  menuItemId: number | null;
  name: string;
  qty: number;
  price: number;
  note?: string;
  confidence?: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  source: "foto" | "manual";
  status: "terkonfirmasi" | "dibatalkan";
  createdBy: string;
  notes?: string;
  photoUrl?: string;
};

export type ExtractionItem = {
  name: string;              // nama menu hasil pencocokan (atau teks mentah bila tak cocok)
  qty: number;
  note?: string;
  confidence: number;        // 0..1
  menuItemId: number | null; // null = tidak ada di menu
};

export type ExtractionResult = {
  items: ExtractionItem[];
  needsReview: boolean;
};

export type JobStatus = "diproses" | "perlu_review" | "terkonfirmasi" | "gagal";

export type ExtractionJob = {
  id: string;
  createdAt: string;
  status: JobStatus;
  photoUrl: string;
  result?: ExtractionResult;
  errorMessage?: string;
};

export type ChatLog = {
  id: string;
  timestamp: string;
  customerPhone: string;
  customerMessage: string;
  botReply: string;
  storeStatusAtTime: "buka" | "tutup";
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
};

export type AutoReplyTemplate = {
  message: string;
  cooldownMinutes: number;
};

export type GalleryItem = {
  id: string;
  url: string;
  alt: string;
  order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  content: string;
  rating?: number;
};

export type SiteContent = {
  storeName: string;
  tagline: string;
  description: string;
  story: string;
  establishedYear: number;
  highlights: string[];
  whatsapp: string;
  instagram: string;
  address: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  gallery: GalleryItem[];
  testimonials: Testimonial[];
};

export type SessionUser = {
  uid: string;
  name: string;
  email: string;
  role: Role;
  exp: number;
};

