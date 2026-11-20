# Entity Relationship Diagram (ERD)

Dokumentasi rancangan database SQLite (Prisma ORM) untuk sistem **Mie Ayam Surabaya**.

```mermaid
erDiagram
    StoreProfile {
        Int id PK
        String name
        String tagline
        String shortDescription
        String story
        String address
        String mapsUrl
        String mapsEmbedUrl
        String whatsappNumber
        String instagramUrl
        String logoUrl
        String heroImageUrl
        DateTime updatedAt
    }

    StoreStatus {
        Int id PK
        Boolean isOpen
        Boolean manualOverride
        String statusNote
        String nextOpenText
        DateTime updatedAt
    }

    OperatingSchedule {
        Int id PK
        String dayName
        Int dayOfWeek
        String openTime
        String closeTime
        Boolean isClosed
    }

    MenuCategory {
        Int id PK
        String name
        String slug UK
        Int order
        DateTime createdAt
    }

    MenuItem {
        Int id PK
        Int categoryId FK
        String name
        String description
        Int price
        String imageUrl
        Boolean isAvailable
        Boolean isFeatured
        String badge
        Int order
        DateTime createdAt
        DateTime updatedAt
    }

    GalleryImage {
        Int id PK
        String title
        String caption
        String imageUrl
        Int order
        DateTime createdAt
    }

    ChatLog {
        Int id PK
        String senderId
        String platform
        String userMessage
        String normalizedMessage
        String detectedIntent
        Float confidence
        String botReply
        Boolean escalateToOwner
        Boolean isResolved
        DateTime createdAt
    }

    MenuCategory ||--o{ MenuItem : "has"
```

## Ringkasan Tabel

1. **Profil & Operasional Toko**
   - `StoreProfile`: Informasi identitas warung (nama, tagline, cerita, alamat, link Maps, nomor WhatsApp, Instagram).
   - `StoreStatus`: Status buka/tutup real-time (`isOpen`, `manualOverride`, `statusNote`, `nextOpenText`) untuk halaman publik dan *live grounding* chatbot.
   - `OperatingSchedule`: Jadwal operasional harian (Senin–Minggu, jam buka/tutup, flag libur).
2. **Katalog Menu & Galeri**
   - `MenuCategory` & `MenuItem`: Daftar kategori dan menu makanan/minuman beserta harga, ketersediaan (`isAvailable`), dan badge.
   - `GalleryImage`: Aset gambar dokumentasi/hidangan.
3. **Chatbot Auto-Reply**
   - `ChatLog`: Menyimpan riwayat percakapan dari Web Chat Widget maupun WhatsApp Webhook (`senderId`, `platform`), hasil normalisasi slang (`normalizedMessage`), prediksi intent (`detectedIntent`, `confidence`), balasan bot (`botReply`), serta flag eskalasi keluhan ke pemilik (`escalateToOwner`, `isResolved`).

