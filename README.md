# 📊 FMCG Dashboard Demo (Tableau Embedding)

Proyek ini adalah demo untuk menampilkan **dashboard Tableau** yang di-embed ke dalam website.  
Tujuan utamanya adalah untuk menunjukan kepada calon klien (khususnya sektor **FMCG**) bahwa dashboard Tableau dapat diintegrasikan dengan mudah ke dalam aplikasi web.

---

## 🚀 Fitur Utama
- Embedding beberapa dashboard Tableau Public secara dinamis.
- Navigasi antar-dashboard dengan tombol (Summary, Sales Performance, Channel, Geography, Product, Trend).
- Tampilan web responsif dengan desain modern menggunakan CSS.
- Judul dashboard otomatis berubah sesuai dengan dashboard yang sedang ditampilkan.
- Struktur kode dipisahkan: `index.html`, `style.css`, dan `app.js`.

---

## 📂 Struktur Folder
- index.html # Struktur utama halaman web 
- style.css # Styling (tampilan) website
- app.js # Logic untuk menampilkan dashboard Tableau
- README.md # Dokumentasi proyek

---

## ⚙️ Cara Menjalankan
1. **Clone repository** atau download project ini.
   ```bash
   git clone <url-repository-anda>
2. Pastikan semua file (index.html, style.css, app.js) berada dalam satu folder.

3. Buka file index.html menggunakan browser (Chrome, Edge, Firefox, dsb).

4. Klik tombol navigasi di header untuk berpindah antar dashboard Tableau.

---

## 📌 Penjelasan File
1. index.html

Membuat struktur dasar web.

Menyediakan header dengan tombol navigasi.

Menyediakan container (#vizContainer) tempat dashboard Tableau ditampilkan.

Memanggil app.js untuk logika interaksi.

2. style.css

Mengatur tampilan website agar lebih modern dan profesional.

Menggunakan warna biru sebagai tema utama (konsisten dengan nuansa corporate/FMCG).

Menyediakan layout header, main content, dan footer.

3. app.js

Menggunakan Tableau JavaScript API untuk menampilkan dashboard.

Fungsi utama:

initViz(sheetName) → inisialisasi dashboard sesuai parameter.

switchViz(sheetName) → mengganti dashboard ketika tombol diklik.

Judul (#dashboardTitle) otomatis berubah sesuai dashboard yang ditampilkan.

---
## 🖼️ Preview Layout

Header dengan logo + tombol navigasi.

Judul dashboard di tengah.

Container besar untuk menampilkan Tableau dashboard.

Footer sederhana.
---
## 🔗 Sumber Data

Untuk demo ini, digunakan dashboard dummy dari Tableau Public.
Nantinya bisa diganti dengan dashboard internal perusahaan sesuai kebutuhan.
---
## 🏆 Tujuan Proyek

Menunjukkan kemampuan embedding Tableau di aplikasi web.

Memberikan gambaran nyata kepada klien bagaimana dashboard FMCG dapat diakses lebih mudah melalui website.

Menjadi dasar presentasi/demo sebelum implementasi ke sistem yang lebih besar.
---
## 👨‍💻 Pengembang

Project ini dibuat untuk keperluan demo internal dan presentasi kepada calon klien FMCG.
Dikembangkan menggunakan:

HTML5

CSS3

JavaScript

Tableau JavaScript API
