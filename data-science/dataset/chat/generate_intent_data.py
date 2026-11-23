"""
Dataset Generator untuk Intent Classification Chatbot Mie Ayam Surabaya.
Menghasilkan ~350-450 data percakapan pelanggan yang kaya variasi slang & dialek lokal.
"""

import pandas as pd
import random

random.seed(42)

tanya_produk_base = [
    # Menu & Varian
    "kak mie ayam original harganya berapaan ya?",
    "min daftar menu mie ayam ada apa aja?",
    "mie ayam bakso sama mie ayam pangsit bedanya apa kak?",
    "harga mie komplit berapa min seporsi?",
    "ada menu bakso kuah aja ga kak tanpa mie?",
    "pangsit gorengnya isi berapa biji ya?",
    "min menu es teler istimewa masih ada ga hari ini?",
    "es teh manis nya berapaan ya kak?",
    "teh hangatnya manis apa tawar kak?",
    "bisa liat daftar harga lengkapnya ga min?",
    "kalo nambah topping bakso sapi harganya berapa?",
    "mie ayamnya ini halal gak min?",
    "mie ayam disini pake minyak babi apa minyak ayam halal?",
    "apakah ada pilihan mie yamin manis gurih?",
    "porsi mie ayamnya kenyang ga kak bwt makan siang?",
    "mie ayam oriental surabaya ini kuahnya dipisah atau campur?",
    "ada kerupuk kaleng putih ga min di warung?",
    "kalo mie komplit itu dapet bakso berapa biji kak?",
    "es teler pake nangka sama alpukat asli gak?",
    "ada kuah kaldu sapi atau kuah kaldu ayam min?",
    "bisa minta sawinya dibanyakin ga kak?",
    "mie pangsit kuah apa pangsit goreng min?",
    "harga menu makanan paling murah berapaan kak?",
    "apakah mie nya bikin sendiri atau mie pabrikan?",
    "toping ayamnya manis apa asin gurih kak?",
    "apakah ada porsi jumbo atau dobel mie?",
    "sambal mie ayamnya pedas banget gak min?",
    "min kuah kaldunya pake kaldu ayam kampung ya?",
    "apakah ada menu nasi atau cuma olahan mie aja?",
    "menu favorit best seller di sini apa ya kak?",
    "topping jamurnya pake jamur kancing apa tiram min?",
    "pangsit rebusnya lembut gak ya kak?",
    "es jeruk nipis ada gak min selain es teh?",
    "apakah mie ayamnya bebas pengawet?",
    "bisa request mie setengah matang gak min?",
    "menu mie ayam lada hitam ada gak min?",
    "topping daging ayamnya cincang atau potongan dadu?",
    "apakah kuahnya berlemak gurih kak?",
    "es batunya pake air matang kan ya min?",
    "min ada camilan siomay atau dimsum gak?",
    
    # Lokasi & Rute
    "lokasi warungnya di sebelah mana ya kak?",
    "min alamat lengkap mie ayam surabaya dimana?",
    "warungnya yang di taman pinang indah sidoarjo ya?",
    "patokan lokasinya deket apa ya min kalo dr alun-alun sidoarjo?",
    "ada parkiran mobil ga kak di warungnya?",
    "kalo dari arah surabaya lewat mana ya min?",
    "apakah ada cabang lain selain di sidoarjo?",
    "warungnya pinggir jalan raya apa masuk gang min?",
    "bisa minta share lock google maps nya kak?",
    "warung mie ayam surabaya deket gor sidoarjo ga?",
    "deket rs delta surya gak ya min lokasinya?",
    "apakah bisa makan di tempat langsung di warung?",
    "tempatnya ada ac nya atau semi outdoor kak?",
    "tersedia fasilitas toilet dan musholla gak min?",
    "warungnya rame gak min kalo jam makan siang?",

    # Jam Buka & Hari Libur
    "min hari ini warung buka jam berapa sampai jam berapa?",
    "hari minggu tetap buka ga kak?",
    "warung buka jam berapa ya min?",
    "apakah malam ini masih buka jam 8 malam?",
    "toko libur tiap hari apa ya kak?",
    "kak hari senin besok buka gak?",
    "jam operasional mie ayam surabaya jam brp?",
    "kalo tanggal merah tetep buka apa libur min?",
    "jam istirahat siang warung tutup ga kak?",
    "malam ini tutup jam berapa ya min?",
    "sekarang warungnya udah buka belom ya kak?",
    "toko buka ga hari ini min?",
    "besok libur ga min warungnya?",
    "halo min hari ini ready sampe jam brp?",
    "apakah buka saat libur cuti bersama kak?",
    "kalo pagi jam 9 sudah bisa beli belum ya min?",
    "terakhir order jam berapa ya kak sebelum tutup?",
    "hari jumat buka jam berapa setelah sholat jumat?"
]

pemesanan_base = [
    "halo min mau pesen mie ayam komplit 2 porsi bisa?",
    "bisa pesan antar ke perumahan taman pinang ga kak?",
    "cara order mie ayam via whatsapp gimana ya kak?",
    "kak mau pesan mie ayam original 3 bungkus bawa pulang ya",
    "min bisa delivery ke daerah jetis sidoarjo gak?",
    "halo mau order buat makan di tempat nanti siang jam 12",
    "kak saya mau pesen mie ayam pangsit 4 sama es teh 4 bungkus",
    "bisa order lewat gofood atau grabfood gak min?",
    "apakah bisa pesan buat acara arisan 30 porsi besok sabtu?",
    "min mau pesan mie ayam bakso 2, 1 pedas 1 gak pedas",
    "tolong siapin 5 porsi mie komplit ya kak, nanti saya ambil jam 1",
    "bisa pesen take away sekarang gak kak?",
    "min nomor rekening bca warung buat transfer pesanan berapa?",
    "saya mau pesen delivery order bayar pake qris bisa?",
    "halo kak mau pesan mie ayam 10 bungkus buat kantor",
    "min order mie pangsit 2 porsi tanpa sawi bungkus ya",
    "kak bisa kirim kurir ke jl pahlawan sidoarjo?",
    "format pemesanan mie ayam gimana ya min?",
    "saya mau pesan untuk catering acara ulang tahun bisa kah?",
    "bisa keep pesanan dulu ga kak saya lg jalan ke warung",
    "pesen mie ayam bakso 1, es teler 1 tolong dianter ke meja 4",
    "kak order mie ayam biasa 2 porsi dipisah kuahnya ya",
    "min mau pesen sekarang diantar jam 5 sore bisa?",
    "bisa bayar cod ga kak klo delivery?",
    "order mie komplit 1 pedes banget ya kak",
    "min mau pesan porsi banyak dapet potongan harga gak?",
    "mau booking meja untuk rombongan 8 orang jam 7 malam ya",
    "pesan mie ayam 3 porsi jangan pake daun bawang ya min",
    "kak minta tolong kuahnya dipisah ya jangan dicampur langsung",
    "tolong kirim rek briva atau mandiri buat bayar pesanan ini",
    "bisa pesan mie ayam lewat shopeefood min?",
    "halo saya mau order 15 bungkus buat rapat guru besok pagi",
    "min mau tambah pesanan es teh 2 lagi dong di meja 2",
    "order mie ayam biasa 2 sama bakso tambahan 1 porsi dibungkus",
    "kak mau pesan sekarang kira-kira berapa lama ya masaknya?"
]

keluhan_base = [
    "min pesanan saya kok belum sampai ya, udah nunggu 1 jam lebih nih",
    "kak tadi saya pesan mie ayam komplit tapi kok baksonya ga ada?",
    "kuah mie ayamnya tumpah semua di plastik min gimana nih!",
    "pelayanan kasirnya tadi judes banget ya kak kurang ramah",
    "mie nya lembek banget kaya bubur ga kenyal sama sekali kecewa",
    "tadi minta tanpa sawi kok tetep dikasih sawi banyak banget sih",
    "es teh manisnya tawar banget gak ada gulanya sama sekali kak",
    "pangsit gorengnya keras banget alot dan bau apek min",
    "kembalian saya tadi kurang 10 ribu kak kasirnya lupa ngasih",
    "saya nunggu antrian 45 menit padahal meja lain yang baru dateng dilayani duluan",
    "ayamnya ada yang bau basi kak tolong dicek kebersihan dapurnya!",
    "kecewa banget hari ini kuahnya dingin dan hambar",
    "tadi pesen pedas tapi dikasih yang manis gimana sih min",
    "min pesenan take away saya ketuker sama meja sebelah",
    "porsi mie nya sekarang kok makin dikit ya beda sama dulu",
    "tadi saya nemu helai rambut di mangkok mie ayam tolong dong higienisnya dijaga",
    "driver gojeknya bilang pesanan belum dibuatkan padahal di app status selesai",
    "baksonya ada yang masih beku di dalem kak kurang mateng masaknya",
    "min mau komplain soal pelayanan di kasir tadi siang",
    "pesanan via wa ga dibales-bales padahal status online dari tadi!",
    "kuah kaldunya hari ini asin banget kebangetan gak bisa kemakan",
    "sambalnya asem kaya sambal kemarin basi min tolong diganti",
    "tadi saya pesan 3 porsi dibungkus pas dibuka cuma ada 2 porsi!",
    "meja makannya kotor berminyak belum dilap sama pelayan",
    "saya bayar pake qris saldo kepotong tapi kasirnya bilang belum masuk dan suruh bayar tunai lagi"
]

lainnya_base = [
    "halo kak",
    "selamat pagi min",
    "assalamualaikum wr wb min",
    "p",
    "halo selamat siang",
    "sore min",
    "malam kak",
    "salam kenal ya min",
    "makasih banyak ya kak infonya",
    "siap min terima kasih",
    "ok kak noted",
    "mantap min sukses selalu usahanya ya",
    "apakah cuaca di sidoarjo lagi hujan min?",
    "min resep bumbu rahasia mie ayam oriental nya apa ya?",
    "kak mau nanya pilkada sidoarjo siapa yang menang ya?",
    "min ada lowongan kerja buat bagian dapur ga?",
    "punya rekomendasi bengkel motor deket situ ga kak?",
    "lagi gabut aja nih min sapa tau bisa ngobrol",
    "cie min adminnya cowo apa cewe nih?",
    "min tau ga cara bikin kuah kaldu sapi gurih?",
    "kak mie ayam terenak di dunia menurut kamu apa?",
    "tes tes 1 2 3 apakah bot aktif?",
    "ping p",
    "selamat malam salam sejahtera",
    "semoga warungnya tambah laris berkah ya min",
    "kamu ini robot apa orang beneran sih?",
    "min presiden indonesia sekarang siapa?",
    "rekomendasi tempat wisata anak di sidoarjo apa ya min?",
    "min bisa pinjam seratus dulu gak buat besok?",
    "gimana cara bikin akun instagram bisnis ya kak?"
]

variasi_awalan = ["", "halo ", "permisi kak ", "mau nanya dong ", "min mau tanya ", "kak mau tanya ", "misi ", "assalamu alaikum "]
variasi_akhiran = ["", " ya kak", " dong min", " makasih", " tolong infonya ya", " terimakasih", " kak", " min"]

def variasi_kalimat(base_list, intent_label, target_count):
    res = []
    # Masukkan kalimat dasar
    for s in base_list:
        res.append({"text": s, "intent": intent_label})
    
    # Buat variasi kombinatorial realistis
    while len(res) < target_count:
        kalimat = random.choice(base_list)
        prefix = random.choice(variasi_awalan)
        suffix = random.choice(variasi_akhiran)
        
        # Bersihkan awalan bawaan jika ada
        t = kalimat
        for p in ["halo ", "min ", "kak ", "permisi "]:
            if t.startswith(p):
                t = t[len(p):]
        
        # Gabungkan
        new_text = f"{prefix}{t}{suffix}".strip().lower()
        # Singkatan chat umum
        if random.random() > 0.5:
            new_text = new_text.replace("berapa", "brp").replace("sudah", "udh").replace("tidak", "ga").replace("bisa", "bs")
        res.append({"text": new_text, "intent": intent_label})
    return res

# Distribusi terukur (~400 total sampel sebelum SMOTE)
all_data = []
all_data.extend(variasi_kalimat(tanya_produk_base, "tanya_produk", 180)) # ~45%
all_data.extend(variasi_kalimat(pemesanan_base, "pemesanan", 100))       # ~25%
all_data.extend(variasi_kalimat(keluhan_base, "keluhan", 60))           # ~15%
all_data.extend(variasi_kalimat(lainnya_base, "lainnya", 60))           # ~15%

df = pd.DataFrame(all_data)
df = df.drop_duplicates(subset=["text"]).sample(frac=1.0, random_state=42).reset_index(drop=True)

output_path = "data-science/dataset/chat/intent_dataset.csv"
df.to_csv(output_path, index=False)
print(f"Dataset berhasil disimpan di: {output_path}")
print(f"Total sampel unik: {len(df)}")
print("\nDistribusi Frekuensi Kelas:")
print(df["intent"].value_counts())
print("\nDistribusi Persentase (%):")
print((df["intent"].value_counts(normalize=True) * 100).round(2))
