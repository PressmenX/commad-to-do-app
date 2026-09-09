# 📋 Plan Document: To-Do List App (Command-Based)

## 1. Latar Belakang & Tujuan
Membuat to-do list pribadi berbasis web (PWA) untuk mengatasi keterbatasan aplikasi to-do list yang sudah ada di HP (fitur premium, tampilan tidak bisa dikustomisasi, tidak bisa menambah banyak tugas sekaligus).

Tampilan terinspirasi dari to-do list berbasis AI (format tabel dengan ID), dikombinasikan dengan sistem command mirip terminal untuk kontrol cepat.

**Fokus:** menyelesaikan masalah yang sudah ada sekarang. Fitur AI dalam app ditunda ke fase berikutnya.

---

## 2. Struktur Data Task

| Kolom | Keterangan |
|---|---|
| ID | Angka tetap, tidak pernah di-reuse (lanjut dari angka tertinggi yang pernah dipakai, meski ada ID yang dihapus di tengah) |
| Task Name | Nama tugas (string) |
| Details | Deskripsi/catatan tambahan (string, boleh kosong) |
| Priority | Angka, contoh: `1` = tinggi, dst |
| Category | Label bebas |
| Status | Belum / Done |

---

## 3. Tampilan

### Dua Mode Tampilan (toggle, preferensi tersimpan)
| Mode | Cocok untuk |
|---|---|
| **Table View** | Melihat semua kolom sekaligus, rapi untuk data banyak |
| **Card/List View** | Tampilan umum seperti to-do app biasa — tiap task jadi card dengan checkbox, judul, badge priority & category. Details bisa expand saat diklik |

### Aksi di Tabel/Card
- Tombol aksi per baris: ✅ Done, 🗑️ Delete
- Checkbox seleksi multi-task + tombol aksi massal (Mark Done Selected / Delete Selected)
- Command bar tetap tersedia untuk aksi cepat/batch via ketikan

### Indikator Progress
- Progress bar di bagian atas: "X dari Y task selesai (Z%)"
- Update otomatis setiap ada perubahan status task

### Fitur Sort
Bisa sort berdasarkan: ID, Priority, Category, Status, Alfabetis (nama task) — via tombol/dropdown di atas tabel.

---

## 4. Sistem Command

### Notasi
| Simbol | Fungsi | Contoh |
|---|---|---|
| `#` | Menandai ID | `#1`, `#1-#3` |
| `@` | Menandai Priority | `@1` (tinggi), `@2`, dst |

### Command Dasar
| Command | Fungsi |
|---|---|
| `MD #[id]` | Mark Done |
| `MKDEL #[id]` | Mark Done + Delete |
| `DEL #[id]` | Delete |
| `MD MANY [id list]` | Mark Done banyak sekaligus |
| `MKDEL MANY [id list]` | Mark Done + Delete banyak sekaligus |
| `DEL MANY [id list]` | Delete banyak sekaligus |
| `ADD MANY` | Tambah banyak task sekaligus |
| `UNDO` | Membatalkan aksi terakhir |
| `EXPORT` | Ekspor data ke file `.json` |
| `IMPORT` | Impor data dari file `.json` |
| *(command lain)* | Menyusul, ditentukan sendiri oleh user sesuai kebutuhan — sistem parser command harus dibuat *extensible* |

### Format List ID untuk Command "MANY"
Kombinasi **range** dan **koma**:
```
MD MANY #1,#3,#5
MD MANY #1-#5
MD MANY #1-#3,#7,#9
```

**Aturan parsing range:**
1. Range `a-b` → ambil semua ID yang **ada** di antara a dan b (inklusif)
2. ID yang hilang di tengah rentang (karena pernah dihapus) → di-skip otomatis, **bukan error**
3. Jika ID batas awal atau akhir rentang **tidak ada** → tampilkan error, command dibatalkan
4. Kombinasi range + koma tetap didukung

### Format Command `ADD MANY`
```
ADD MANY
- "Name" "Details" @priority
- "Name" "Details" @priority
```
- Name & Details menggunakan tanda kutip (`" "`) sebagai delimiter (karena keduanya bisa berupa kalimat bebas)
- Details boleh dikosongkan (`""`)
- Priority (`@n`) opsional

### Feedback Command
Setiap command yang dieksekusi menampilkan "echo" hasil, contoh:
> ✅ 2 task ditandai selesai (ID 1, 3)

Penting terutama untuk command MANY karena ada ID yang di-skip.

---

## 5. Fitur Undo (1 Langkah Terakhir)

**Bukan** riwayat aksi bertingkat (seperti git). Cukup 1 slot yang menyimpan aksi terakhir.

**Struktur data:**
```
previousAction = {
  type: "DEL",
  data: [ {id: 5, name: "...", details: "...", priority: 1, status: "belum"} ]
}
```

**Alur kerja:**
1. Sebelum command destruktif dieksekusi (`DEL`, `MKDEL`, dll), data yang terdampak disimpan ke `previousAction`
2. `UNDO` → baca `previousAction`, kembalikan data ke tabel, lalu reset `previousAction` jadi `null`
3. Command lain dijalankan → `previousAction` ditimpa dengan aksi baru (bukan array/list, cuma 1 slot)

Untuk command MANY, seluruh task yang terdampak disimpan sebagai satu paket, di-restore bersamaan saat UNDO.

*(Catatan: kalau nanti butuh riwayat lebih dari 1 langkah, konsepnya bisa dikembangkan jadi Stack/Linked List — tapi array biasa dengan `push()`/`pop()` sudah cukup, tidak perlu implementasi Linked List manual kecuali untuk latihan struktur data)*

---

## 6. Export & Import (Backup Data)

**Kenapa dibutuhkan:** data tersimpan lokal (IndexedDB) — kalau cache browser di-clear, ganti HP, atau app di-uninstall, data hilang permanen tanpa cara mengembalikan.

| Fitur | Cara kerja |
|---|---|
| Export | Command `EXPORT` / tombol → download seluruh data jadi 1 file `.json` |
| Import | Command `IMPORT` / tombol → pilih file `.json` → data ter-load kembali ke app |

Format JSON dipilih karena struktur task punya banyak field (cocok untuk data terstruktur), dan tidak perlu menangani escape karakter rumit seperti pada CSV.

---

## 7. Auto-Suggestion (Basic)

- Sumber: histori task yang pernah diinput (disimpan lokal)
- Metode: fuzzy search (toleran typo), menggunakan library ringan seperti Fuse.js
- Muncul saat mulai mengetik di form/command `ADD`
- **Bukan** AI generatif — itu masuk fase "Fitur AI dalam app" yang sengaja ditunda

---

## 8. Fitur MVP (Scope Sekarang)

- ✅ Tabel/Card task dengan ID, Name, Details, Priority, Category, Status
- ✅ Toggle Table View ↔ Card View
- ✅ Tombol aksi per baris (Done/Delete) + checkbox seleksi multi-task
- ✅ Command bar dengan command dasar (`MD`, `MKDEL`, `DEL`, `MD MANY`, `MKDEL MANY`, `ADD MANY`)
- ✅ Progress bar keseluruhan (persentase task selesai)
- ✅ Fitur Sort (ID, Priority, Category, Status, Alfabetis)
- ✅ Undo 1 langkah terakhir
- ✅ Export & Import data (`.json`)
- ✅ Auto-suggestion basic (fuzzy search dari histori lokal)
- ✅ Data tersimpan lokal (offline-capable)
- ✅ Bisa di-install ke home screen Android (PWA)

---

## 9. Di Luar Scope Sekarang (Sengaja Ditunda)

| Fitur | Alasan ditunda |
|---|---|
| Fitur AI dalam app | Nanti, setelah dasar solid |
| Widget home screen native | PWA belum full dukung fitur ini (masih tahap proposal/eksperimen di kalangan pengembang web) |
| Reminder, waktu, tanggal jatuh tempo | Belum jadi masalah saat ini |
| Riwayat aksi bertingkat (seperti git) | Kebutuhan belum konkret, Undo 1 langkah sudah cukup menutup risiko human error |
| Sync lintas device / multi-user / login | Belum ada kebutuhan konkret sekarang |

---

## 10. Tech Stack

### Fase Sekarang (Frontend-only)
| Layer | Teknologi |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind + DaisyUI |
| State/Data lokal | IndexedDB via Dexie.js |
| PWA | vite-plugin-pwa (manifest + service worker) |
| Export/Import | Native File API (`.json`), tanpa library tambahan |
| Auto-suggestion | Fuse.js (fuzzy search) |

**Kenapa DaisyUI cocok:** komponen `table` untuk Table View, `card` + `badge` untuk Card View (priority/category), `progress` untuk indikator persentase, `toggle` untuk switch mode tampilan, `modal` untuk konfirmasi Export/Import.

### Fase 2 (kalau nanti dibutuhkan — sync & multi-device)
| Layer | Teknologi |
|---|---|
| Backend | Nest.js / Express |
| Database | PostgreSQL + Prisma |
| Deployment | Docker |
| Auth | AuthN & AuthZ |

---

## 11. Tahapan Build (Saran Urutan)

1. MVP inti: tambah/hapus/centang tugas + simpan lokal (IndexedDB)
2. Tambah kolom lengkap (Details, Priority, Category) + progress bar
3. Bangun sistem command parser (extensible) + command dasar
4. Tambah command `MANY` dengan logic range/koma + Undo 1 langkah
5. Tambah Table View ↔ Card View toggle + Sort
6. Setup PWA (manifest + service worker) agar bisa di-install ke home screen
7. Tambah Export/Import + Auto-suggestion
8. (Fase 2, opsional) Backend untuk sync & multi-device