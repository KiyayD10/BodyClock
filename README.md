# 🕒 BodyClock

**Personal offline-first health & lifestyle tracker**

**BodyClock**. Aplikasi mobile pribadi yang saya bikin buat bantu kamu tracking rutinitas harian, jadwal makan, alarm, dan resep masakan—semuanya tersimpan lokal di device tanpa butuh internet!

---

## ✨ Fitur Utama

### 🌅 Alur Pagi ( # proses )

* **Wake Alarm**: Alarm bangun tidur yang tetap bunyi walau app ditutup.
* **Morning Notes**: Tracking mood, kualitas tidur, dan level energi tiap pagi.
* **Auto-appear**: Form catatan pagi muncul otomatis 1x sehari setelah alarm bunyi.

### 📅 Today Tracker ( # Proses )

* **Meal Checklist**: Tracking sarapan, siang, dan malam dengan progress visual.
* **Daily Progress**: Ada lingkaran progress buat monitoring penyelesaian tugas hari ini.
* **Auto Reset**: Data harian bakal reset otomatis setiap ganti hari (tengah malam).

### 🍳 Recipe Manager

* **Personal Recipes**: Simpan resep masakan pribadi kamu di sini.
* **Smart Search**: Cari resep gampang lewat judul, bahan, atau kategori.
* **Safe Delete**: Biar nggak asal hapus, kamu harus ketik ulang nama resepnya buat hapus permanen.
* **Permanent Storage**: Tenang, resep masakan kamu nggak bakal ikut kehapus pas reset harian.

---

## 🛠️ Tech Stack

* **Framework**: Expo SDK 52 (Versi terbaru 2025)
* **Language**: TypeScript (Biar kodenya rapi dan minim error)
* **Routing**: Expo Router (Sistem folder)
* **Database**: SQLite (expo-sqlite) — Rajanya simpan data offline
* **State**: Zustand — Simpel buat atur tema aplikasi

---

## 📁 Struktur Proyek (Tree)

Berikut adalah peta folder di dalam proyek ini biar nggak bingung nyarinya:

```bash
frontend/
├── app/                        # Expo Router (Halaman Utama)
│   ├── (tabs)/                 # Menu Bawah (Tabs)
│   │   ├── _layout.tsx         # Layout Tab Bar & Safe Area
│   │   ├── alarm.tsx           # Halaman Atur Alarm
│   │   ├── index.tsx           # Dashboard / Home
│   │   ├── profile.tsx         # Pengaturan Tema & App
│   │   ├── recipes.tsx         # Daftar Resep Masakan
│   │   └── today.tsx           # Tracking Aktivitas Hari Ini
│   ├── recipes/                # Fitur Resep (Stack)
│   │   ├── [id].tsx            # Detail Resep (Dynamic Route)
│   │   ├── _layout.tsx         # Header Navigasi Resep
│   │   └── create.tsx          # Form Tambah Resep Baru
│   └── +not-found.tsx          # Halaman Error 404
├── src/                        # Otak Aplikasi
│   ├── components/             # Komponen UI
│   │   ├── features/           # Komponen Spesifik (AlarmCard, RecipeSearchBar)
│   │   └── ui/                 # Komponen Dasar (Button, Card, Text)
│   ├── constants/              # Warna & Tema (Design Tokens)
│   ├── database/               # Manajemen SQLite
│   │   ├── repositories/       # Logika Query (Recipes, Meals, Alarms)
│   │   ├── db.ts               # Inisialisasi Database
│   │   └── schema.sql          # Blueprint Tabel SQL
│   ├── hooks/                  # Custom React Hooks (useAlarm, useRecipes)
│   ├── services/               # Sistem (AlarmManager, NotificationService)
│   ├── store/                  # Global State (themeStore.ts)
│   ├── types/                  # Definisi Data (TypeScript)
│   └── utils/                  # Helper (dailyReset.ts)
├── assets/                     # Ikon & Media Aplikasi
├── app.json                    # Konfigurasi Expo & Android ID
└── eas.json                    # Konfigurasi Build APK

```

---

## 🗄️ Skema Database

Aplikasi ini pake **SQLite** buat simpan data kamu. Ada 5 tabel utama:

1. **`recipes`**: Simpan resep masakan kamu selamanya (Permanent).
2. **`meals`**: Template jadwal makan (Sarapan, Siang, Malam).
3. **`daily_meals`**: Catatan checklist makan harian (Reset tiap hari).
4. **`morning_notes`**: Catatan mood dan energi tiap pagi (Reset tiap hari).
5. **`settings`**: Simpan pilihan tema dan jam alarm kamu.

---

## 🚀 Cara Mulai

Kalo mau coba jalanin di laptop kamu, ikutin langkah ini:

1. **Install Bahan**:
```bash
npm install

```


2. **Jalanin Server**:
```bash
npx expo start

```


3. **Buka di HP**: Scan QR Code-nya pake aplikasi **Expo Go** di Android kamu.

---

## 📝 Catatan Perubahan (Changelog)

### v1.0.0 (Januari 2025)

* ✨ Rilis perdana.
* 🌅 Alur pagi (alarm & notes) lancar.
* 📅 Checklist harian & progress visual.
* 🍳 Manager resep lengkap dengan filter.
* 🌙 Mode Gelap/Terang mantap.

---

**buat anak kos dipake sendiri selamanya!**

## 📄 License

MIT License

---
