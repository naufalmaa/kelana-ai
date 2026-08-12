# KelanaAI - Trip Summary Generator

KelanaAI adalah aplikasi perencanaan perjalanan berbasis Python. Pada sesi pertama ini, aplikasi hadir dalam bentuk **Console Application** interaktif yang menerima masukan rencana perjalanan pengguna dan menampilkan ringkasannya secara rapi dan terstruktur.

---

## 📁 Struktur Proyek

```text
kelana-ai/
├── README.md
├── backend/
│   └── main.py
└── frontend/
    └── .gitkeep
```

- **`backend/main.py`**: Mengandung logika utama aplikasi konsol Python (`print_trip_summary`, pemrosesan `int()` dan `float()`, serta penanganan input pengguna).
- **`frontend/.gitkeep`**: Menjaga struktur folder frontend agar terlacak oleh Git untuk pengembangan selanjutnya.
- **`README.md`**: Dokumentasi proyek.

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan Python (versi 3.x) telah terinstall di sistem Anda.

1. Buka terminal di direktori proyek ini.
2. Jalankan perintah berikut:

```bash
python backend/main.py
```

---

## 🖥️ Contoh Penggunaan & Output

```text
========================================
   Selamat Datang di KelanaAI Generator  
========================================

Masukkan Destinasi   : Japan
Masukkan Negara      : Japan
Masukkan Jumlah Hari : 5
Masukkan Budget      : 1500
Masukkan Mata Uang   : USD
Masukkan Bulan Travel: December

========================
KelanaAI
========================
Destination  : Japan
Country      : Japan
Days         : 5
Budget       : 1500 USD
Currency     : USD
Travel Month : December
========================
```

---

## 🛠️ Panduan Git & Release Management (Nomor 3)

Jika Anda siap melakukan pengerjaan bagian 3, Anda bisa menjalankan perintah berikut di terminal:

```bash
# 1. Inisialisasi Git repository
git init

# 2. Lakukan commit pertama
git add .
git commit -m "Create initial KelanaAI console app"

# 3. Hubungkan ke remote origin repository di GitHub (ganti URL repository Anda)
git remote add origin https://github.com/USERNAME/kelana-ai.git
git branch -M main
git push -u origin main

# 4. Buat Tag Release v0.1.0 dan Push Tag ke GitHub
git tag v0.1.0
git push origin v0.1.0
```
