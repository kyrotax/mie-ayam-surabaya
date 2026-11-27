-- ==============================================================================
-- 1. FIX RLS POLICIES FOR FULL CRUD CAPABILITY
-- ==============================================================================

-- Menu Items Policies
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Public can view available menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Allow all access to menu_items" ON public.menu_items;

CREATE POLICY "Allow all access to menu_items"
ON public.menu_items
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Orders Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all access to orders" ON public.orders;

CREATE POLICY "Allow all access to orders"
ON public.orders
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Store Status Policies
ALTER TABLE public.store_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can update their store status" ON public.store_status;
DROP POLICY IF EXISTS "Public can view store status" ON public.store_status;
DROP POLICY IF EXISTS "Allow all access to store_status" ON public.store_status;

CREATE POLICY "Allow all access to store_status"
ON public.store_status
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- 2. SEED MENU ITEMS DATA (From local mock)
-- ==============================================================================
DELETE FROM public.menu_items;

INSERT INTO public.menu_items (id, name, category, description, price, is_available, aliases, image_url, order_index)
VALUES
(
    1,
    'Mie Ayam Original',
    'Mie Ayam',
    'Mie kenyal dengan topping potongan ayam berbumbu manis gurih khas oriental, sawi hijau, dan kuah kaldu harum.',
    20000,
    true,
    ARRAY['ma', 'mie ayam', 'mie ayam biasa', 'mie biasa', 'mie ori'],
    '/images/menu/mie-ayam.png',
    1
),
(
    2,
    'Mie Ayam Pangsit',
    'Mie Ayam',
    'Mie ayam gurih dengan pangsit rebus lembut dan pangsit goreng renyah.',
    25000,
    true,
    ARRAY['map', 'mie pangsit', 'pgr', 'pangsit', 'mie ayam pangsit'],
    '/images/menu/mie-pangsit.png',
    2
),
(
    3,
    'Mie Ayam Bakso',
    'Mie Ayam',
    'Mie ayam oriental dengan 2 butir bakso sapi kenyal berdaging gurih.',
    25000,
    true,
    ARRAY['mab', 'mie bakso', 'bakso', 'mie ayam bakso', 'bks'],
    '/images/menu/mie-bakso.png',
    3
),
(
    4,
    'Mie Ayam Komplit',
    'Mie Ayam',
    'Pilihan paling favorit: mie ayam dengan topping ayam melimpah, bakso sapi, dan pangsit renyah.',
    30000,
    true,
    ARRAY['mak', 'komplit', 'mie komplit', 'mie ayam komplit'],
    '/images/menu/mie-komplit.png',
    4
),
(
    5,
    'Es Teh Manis',
    'Minuman',
    'Teh melati seduh segar dengan es batu dingin menyegarkan.',
    5000,
    true,
    ARRAY['es teh', 'esteh', 'teh es', 'teh manis dingin'],
    '/images/menu/es-teh.png',
    5
),
(
    6,
    'Teh Hangat',
    'Minuman',
    'Teh melati hangat harum wangi dengan gula alami.',
    5000,
    true,
    ARRAY['teh hangat', 'teh panas', 'teh tubruk'],
    '/images/menu/teh-hangat.jpg',
    6
),
(
    7,
    'Es Teler Istimewa',
    'Minuman',
    'Es teler segar dengan alpukat mentega, kelapa muda, nangka, dan susu kental manis.',
    20000,
    true,
    ARRAY['es teler', 'teler', 'esteler'],
    '/images/menu/es-teler.png',
    7
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    is_available = EXCLUDED.is_available,
    aliases = EXCLUDED.aliases,
    image_url = EXCLUDED.image_url,
    order_index = EXCLUDED.order_index;

-- Reset sequence to continue after 9
SELECT setval(pg_get_serial_sequence('public.menu_items', 'id'), 9, true);

-- ==============================================================================
-- 3. SEED STORE STATUS DATA (From local mock)
-- ==============================================================================
INSERT INTO public.store_status (id, is_open, manual_override, status_note, next_open_text, updated_at)
VALUES
(
    1,
    true,
    'none',
    'Warung sedang buka. Melayani santap di tempat, bawa pulang, dan pesanan WhatsApp.',
    'Buka setiap hari pukul 09.00 sampai 21.00 WIB',
    timezone('utc'::text, now())
)
ON CONFLICT (id) DO UPDATE SET
    is_open = EXCLUDED.is_open,
    manual_override = EXCLUDED.manual_override,
    status_note = EXCLUDED.status_note,
    next_open_text = EXCLUDED.next_open_text,
    updated_at = EXCLUDED.updated_at;

-- ==============================================================================
-- 4. SEED SAMPLE ORDERS DATA (From local mock)
-- ==============================================================================
DELETE FROM public.orders;

INSERT INTO public.orders (order_number, items, total, source, status, created_by, notes, photo_url, created_at)
VALUES
(
    '#ORD-0001',
    '[{"menuItemId": 4, "name": "Mie Ayam Komplit", "qty": 2, "price": 30000}, {"menuItemId": 7, "name": "Es Teh Manis", "qty": 2, "price": 5000}]'::jsonb,
    70000,
    'manual',
    'terkonfirmasi',
    'Kasir Warung',
    'Makan di tempat meja 3',
    NULL,
    timezone('utc'::text, now() - interval '2 hours')
),
(
    '#ORD-0002',
    '[{"menuItemId": 1, "name": "Mie Ayam Original", "qty": 3, "price": 20000}, {"menuItemId": 7, "name": "Es Teler Istimewa", "qty": 2, "price": 20000}]'::jsonb,
    100000,
    'foto',
    'terkonfirmasi',
    'Kasir Warung',
    'Bungkus bawa pulang - kuah dipisah',
    '/images/dummy-catatan-01.jpg',
    timezone('utc'::text, now() - interval '4 hours')
),
(
    '#ORD-0003',
    '[{"menuItemId": 2, "name": "Mie Ayam Pangsit", "qty": 1, "price": 25000}, {"menuItemId": 3, "name": "Mie Ayam Bakso", "qty": 1, "price": 25000}, {"menuItemId": 6, "name": "Teh Hangat", "qty": 2, "price": 5000}]'::jsonb,
    60000,
    'manual',
    'terkonfirmasi',
    'Kasir Warung',
    'Pesan via WhatsApp',
    NULL,
    timezone('utc'::text, now() - interval '1 day')
),
(
    '#ORD-0004',
    '[{"menuItemId": 4, "name": "Mie Ayam Komplit", "qty": 4, "price": 30000}, {"menuItemId": 5, "name": "Es Teh Manis", "qty": 4, "price": 5000}]'::jsonb,
    140000,
    'foto',
    'terkonfirmasi',
    'Kasir Warung',
    'Pesanan rombongan meja 7',
    '/images/dummy-catatan-02.jpg',
    timezone('utc'::text, now() - interval '2 days')
),
(
    '#ORD-0005',
    '[{"menuItemId": 1, "name": "Mie Ayam Original", "qty": 2, "price": 20000}, {"menuItemId": 7, "name": "Es Teh Manis", "qty": 2, "price": 5000}]'::jsonb,
    50000,
    'manual',
    'terkonfirmasi',
    'Kasir Warung',
    'Makan di tempat',
    NULL,
    timezone('utc'::text, now() - interval '3 days')
);

-- ==============================================================================
-- 4. STORAGE SETUP & RLS POLICIES FOR BUCKET 'mie-ayam-surabaya' (SECURE: AUTHENTICATED ONLY)
-- ==============================================================================

-- Buat atau perbarui bucket 'mie-ayam-surabaya' (public untuk read/lihat gambar)
INSERT INTO storage.buckets (id, name, public)
VALUES ('mie-ayam-surabaya', 'mie-ayam-surabaya', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Aktifkan RLS pada tabel storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. HANYA User yang sudah login (Authenticated) yang boleh UPLOAD (INSERT)
DROP POLICY IF EXISTS "Allow upload to mie-ayam-surabaya" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload objects" ON storage.objects;
CREATE POLICY "Authenticated users can upload objects"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mie-ayam-surabaya');

-- 2. Publik boleh MELIHAT (SELECT) foto makanan/menu yang sudah diunggah
DROP POLICY IF EXISTS "Allow view mie-ayam-surabaya" ON storage.objects;
DROP POLICY IF EXISTS "Public can view objects" ON storage.objects;
CREATE POLICY "Public can view objects"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'mie-ayam-surabaya');

-- 3. HANYA User yang sudah login (Authenticated) yang boleh UPDATE foto
DROP POLICY IF EXISTS "Allow update mie-ayam-surabaya" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update objects" ON storage.objects;
CREATE POLICY "Authenticated users can update objects"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'mie-ayam-surabaya');

-- 4. HANYA User yang sudah login (Authenticated) yang boleh HAPUS (DELETE) foto
DROP POLICY IF EXISTS "Allow delete mie-ayam-surabaya" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete objects" ON storage.objects;
CREATE POLICY "Authenticated users can delete objects"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'mie-ayam-surabaya');

