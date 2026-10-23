# pertemuan-4-to-do-list
# Tugasku – To-Do List

Tugas Pemrograman Web dengan tema **Pemecahan Masalah Sehari-hari**.

## Deskripsi Program

Tugasku adalah aplikasi to-do list sederhana untuk mencatat dan memantau tugas harian, seperti tugas kuliah, jadwal belanja, atau pekerjaan rumah. Masalah yang diselesaikan: tugas sering terlupa atau menumpuk karena hanya diingat di kepala. Dengan program ini, semua tugas tercatat lengkap dengan prioritas dan tenggat, dan tetap tersimpan walaupun halaman ditutup.

## Fitur

- **Tambah tugas** dengan pilihan prioritas (tinggi, sedang, rendah) dan tenggat opsional
- **Tandai selesai** lewat checkbox (tugas selesai diberi coretan dan efek stabilo)
- **Ubah tugas**: klik "Ubah", ketik, lalu tekan Enter (Escape untuk batal)
- **Hapus tugas** satu per satu, atau hapus semua yang sudah selesai sekaligus
- **Filter**: semua, belum selesai, atau selesai
- **Penanda terlambat** untuk tugas yang tenggatnya sudah lewat
- **Penghitung** jumlah tugas yang belum selesai
- **Tersimpan otomatis** di browser (localStorage), jadi data tidak hilang saat di-refresh
- Validasi input (tugas kosong tidak bisa ditambahkan)
- Tampilan responsif di HP maupun laptop

## Struktur File

```
todo-list/
├── index.html   # struktur halaman
├── style.css    # tampilan
├── script.js    # logika aplikasi
└── README.md    # penjelasan program
```

## Cara Kerja Singkat

- Semua tugas disimpan dalam sebuah array of object di JavaScript, dengan bentuk `{ id, teks, prioritas, tenggat, selesai }`.
- Setiap ada perubahan (tambah, ubah, hapus, centang), array disimpan ke `localStorage` lalu daftar digambar ulang lewat fungsi `render()`.
- Teks tugas dimasukkan dengan `textContent`, bukan `innerHTML`, supaya aman dari penyisipan kode HTML.
- Aksi pada daftar ditangani dengan *event delegation*: satu listener di elemen `<ul>` untuk semua tugas.

## Cara Menjalankan

1. Download atau clone repository ini.
2. Buka file `index.html` di browser (tidak perlu instalasi apa pun).

Catatan: font diambil dari Google Fonts, jadi perlu koneksi internet agar tampilan sesuai desain. Tanpa internet, aplikasi tetap berfungsi dengan font bawaan.

## Teknologi

HTML5, CSS3 (Grid dan Flexbox), dan JavaScript murni (tanpa library).
