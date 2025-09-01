# 📊 Restaurant Analytics - Tableau Embedding

Aplikasi web ini digunakan untuk **meng-embed dashboard Tableau** ke dalam tampilan custom.  
Fitur utamanya adalah:
- Memilih dashboard (Sales, Purchase, Loss Detection, atau Custom editable viz).
- Mengatur filter berdasarkan **cabang** dan **tahun**.
- Menggunakan **Tableau Embedding API v3** termasuk fitur **Authoring** untuk sheet custom yang editable.

---

## 📂 Struktur Proyek
```plaintext
.
├── index.html      # Halaman utama dengan layout sidebar + content
├── style.css       # Styling UI
└── app.js          # Logic interaksi Tableau dan kontrol UI
```
--
## ⚙️ Prasyarat

1. Tableau Online/Server dengan workbook yang memiliki sheet:

- SalesDashboard
- PurchaseDashboard
- LossDetection
- Custom (sheet kosong untuk editable viz)

2. Hak akses user minimal Viewer untuk dashboard standar, dan Editor untuk sheet Custom.
3. Koneksi internet ke Tableau Embedding API.

--
## 🖼️ Preview Layout
- Sidebar kiri: berisi logo, filter cabang & tahun, serta tombol menu.
- Main content: menampilkan judul halaman dan Tableau Viz yang diembed.

-- 
## 📌 Cara Menjalankan

1. Clone repo / copy file.
2. Buka index.html di browser modern (Chrome, Edge, Firefox).
3. Aplikasi otomatis menampilkan Dashboard Sales saat pertama kali load.
4. Gunakan filter dropdown (Cabang/Tahun) atau tombol menu untuk berpindah dashboard.

--
## 📜 Fungsi-fungsi di app.js
1. Daftar URL & Judul Dashboard
```
const vizList = [ ... ];  // daftar URL Tableau
const titles = [ ... ];   // judul sesuai dashboard
```
- Menyimpan daftar URL view Tableau dan judul yang tampil di header.

2. Helper: Loop Worksheet
```
async function forEachWorksheet(cb) { ... }
```
- Utility untuk mengiterasi semua worksheet dalam workbook aktif.
- Dipakai saat ingin meng-apply filter ke seluruh worksheet.

3. Set Parameter Tahun
```
async function setYearParameterFromUI() { ... }
```
- Mengambil nilai tahun dari dropdown #year.
- Mengupdate parameter Tableau bernama "Tahun Hari Ini" dengan nilai tersebut.

4. Set Filter Cabang
```
async function setBranchFilterFromUI() { ... }
```
- Mengambil nilai cabang dari dropdown #branch.
- Jika "All" → clear filter.
- Jika cabang tertentu → apply filter ke semua worksheet yang punya field Branch.

5. Apply Semua Filter
```
async function applyAllFilters() { ... }
```
- Shortcut untuk menjalankan setYearParameterFromUI() dan setBranchFilterFromUI() sekaligus.
- Dipanggil setelah viz siap digunakan (first interactive).

6. Load Viz
```
function loadViz(index) { ... }
```
- Mengubah konten viz sesuai index menu:

0 → Sales Dashboard

1 → Purchase Dashboard

2 → Loss Detection

3 → Custom Viz (pakai TableauAuthoringViz)

- Khusus index 3, sheet ditampilkan editable dengan toolbar authoring.

7. Handle FirstInteractive
```
function handleFirstInteractive() { ... }
```
- Callback saat Tableau viz siap digunakan.
- Menyimpan reference workbook (workbook = vizEl.workbook).
- Memanggil applyAllFilters() agar filter langsung diterapkan.

8. Inisialisasi onLoad
```
window.onload = function () { ... }
```
- Mendapatkan elemen <tableau-viz>.
- Register event listener untuk FirstInteractive.
- Load viz pertama kali (Sales Dashboard).
- Register event listener untuk:
- Dropdown Tahun → setYearParameterFromUI
- Dropdown Cabang → setBranchFilterFromUI
- Tombol menu → loadViz(index) sesuai dashboard.

--

##🛠️ Ekstensi API yang Digunakan

```
TableauEventType.FirstInteractive → event saat viz siap digunakan.

FilterUpdateType.Replace → mengganti filter dengan nilai baru.

TableauAuthoringViz → komponen khusus untuk sheet editable.
```
