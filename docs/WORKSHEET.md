# Worksheet : Command Todo App

**Tipe project:** Personal PWA to-do list, command-based, hybrid (offline-first + backend sync)
**Deadline:** Tidak ada — project belajar sambil menyelesaikan masalah pribadi
**Stack:** React+TS+Vite+Tailwind+DaisyUI (FE) | Nest/Express+Prisma+PostgreSQL+JWT (BE) | Dexie.js (IndexedDB) | Fuse.js | Docker | Neon (DB) + Render (BE) + Vercel (FE)

---

## ✅ FASE 1: PLANNING

Ringkasan keputusan final dari sesi planning:

- **Data model:** Task { id (auto-increment, no-reuse), name, details, priority, category, status (Belum/Done) }
- **Arsitektur:** Hybrid — IndexedDB primary (offline-first), backend sebagai sync layer + auth gate
- **Konflik sync:** Last-write-wins berdasarkan timestamp
- **Auth:** Single-user, tujuan proteksi akses (bukan multi-user)
- **Command system:** Notasi `#` (ID) dan `@` (priority), command dasar (MD, DEL, MKDEL, MANY variants, ADD MANY), extensible parser
- **Undo:** 1 langkah terakhir, single slot (bukan stack multi-level)
- **Views:** Card View & Table View (toggle, preferensi tersimpan), sort 5 kriteria
- **Export/Import:** Format `.json`
- **Auto-suggestion:** Fuse.js, fuzzy search dari histori lokal
- **Referensi visual:** Sudah di-generate via Google Stitch, disaring sesuai scope (lihat exclusion list — tanpa due date, attachment, status 3-tingkat, sidebar nav, bottom nav)
- **PWA:** Wajib offline-capable, installable ke home screen

---

## ✅FASE 2: SETUP

- [x]  **Unit 1** — Verifikasi environment: Node.js versi LTS, WSL, Docker terinstal & jalan
- [x]  **Unit 2** — Inisialisasi Git repository, struktur folder (tentukan: monorepo dengan `/frontend` `/backend`, atau 2 repo terpisah), `.gitignore` awal
- [x]  **Unit 3** — Setup `docker-compose.yml` untuk PostgreSQL lokal (dev environment, terpisah dari Neon production nanti)
- [x]  **Unit 4** — Inisialisasi project Nest.js/Express + TypeScript
- [x]  **Unit 5** — Setup Prisma, koneksi ke PostgreSQL lokal (Docker), buat schema awal (User, Task)
- [x]  **Unit 6** — Konfigurasi environment variables (`.env`), struktur folder backend (modules/controllers/services)
- [x]  **Unit 7** — Setup linting/formatting (ESLint, Prettier) untuk backend
- [x]  **Unit 8** — Inisialisasi project Vite + React + TypeScript
- [x]  **Unit 9** — Setup Tailwind CSS + DaisyUI, konfigurasi tema dark mode sesuai referensi visual
- [x]  **Unit 10** — Setup Dexie.js, definisikan schema IndexedDB (Task table)
- [x]  **Unit 11** — Setup linting/formatting (ESLint, Prettier) untuk frontend
- [x]  **Unit 12** — Struktur folder frontend (components/hooks/services/types)

**Requirements :** Backend bisa `npm run start:dev` tanpa error dan konek ke DB lokal. Frontend bisa `npm run dev` dan render halaman kosong tanpa error. Docker Compose bisa `up` tanpa konflik port.

---

## FASE 3: BREAKDOWN (Development)

### Domain 1: Backend — Auth & Data API

- [x]  **Unit 13** — Model User di Prisma schema, migration
- [x]  **Unit 14** — Endpoint register & login (JWT/Passport), hashing password
- [x]  **Unit 15** — Middleware/guard proteksi endpoint (JWT verification)
- [x]  **Unit 16** — Model Task di Prisma schema (relasi ke User), migration
- [x]  **Unit 17** — Endpoint CRUD Task (create, read, update, delete) — scoped per user

- **🛑[ Removed] Unit 18** — Endpoint sync (`POST /sync`) — terima batch perubahan dari client, terapkan last-write-wins berdasarkan timestamp

### **🔄Realignment : Perubahan Task ID**

- **Details**
    - Task id → uuid
    - + new task field “taskKey”
    - + new generate id function (nanoId+customAlpabet+4 char) , ex : #a7x2, #b9k1
    - taskey boleh duplikat dalam lingkup Task, tapi harus di beri kombinasi userId+Taskkey agar unik, dan dalam satu database tugas ga boleh ada key yang sama , user beda key sama di bolehkan
- [x]  **Unit 1** — Update `schema.prisma`: ubah `id` Task menjadi UUID, tambah field `taskKey`, dan tambahkan constraint `@@unique([userId, taskKey])`. Jalankan migrasi database.
- [x]  **Unit 2** — Update DTO: tambahkan `taskKey` ke `CreateTaskDto` (sebagai string wajib/opsional) beserta validasinya.
- [x]  **Unit 3** — Refactor Controller & Service: ubah tipe data parameter `id` dari `number` menjadi `string` pada endpoint Get (One), Update, dan Delete.

### Domain 2: Frontend — Core UI & REST API)

- [ ] **Unit 19** — Service layer REST API (fungsi CRUD ke Backend: addTask, updateTask, deleteTask, getTasks)
- [ ] **Unit 20** — UI dasar Card View: render list task dari REST API (belum ada styling final)
- [ ] **Unit 21** — Form tambah task (single) — Name, Details, Priority, Category
- [ ] **Unit 22** — Checkbox mark done + tombol delete per card , update/delete melalui REST API
- [ ] **Unit 23** — Progress bar (hitung otomatis dari jumlah task selesai)

### Domain 3: Command System (Core Logic)

- [ ]  **Unit 24** — Arsitektur command parser: tokenizer, struktur command registry yang extensible (biar command baru gampang ditambah)
- [ ]  **Unit 25** — Command dasar single-ID: `MD #id`, `DEL #id`, `MKDEL #id`
- [ ]  **Unit 26** — Parsing notasi range (`#1-#5`) dan koma (`#1,#3,#5`), termasuk skip ID hilang & error untuk ID batas invalid
- [ ]  **Unit 27** — Command `MD MANY`, `DEL MANY`, `MKDEL MANY` (pakai hasil parsing Unit 26)
- [ ]  **Unit 28** — Command `ADD MANY` — parsing format dengan delimiter kutip (`"Name" "Details" @priority`)
- [ ]  **Unit 29** — Sistem feedback/echo — tampilkan hasil eksekusi command (termasuk yang di-skip)
- [ ]  **Unit 30** — Sistem Undo — simpan snapshot sebelum command destruktif, restore saat `UNDO`, single slot

### Domain 4: Views & Interaksi

- [ ]  **Unit 31** — Table View — render task dalam format tabel sesuai referensi visual
- [ ]  **Unit 32** — Toggle Card View ↔ Table View, simpan preferensi (localStorage/state)
- [ ]  **Unit 33** — Fitur sort (ID, Priority, Category, Status, Alfabetis) — ascending/descending
- [ ]  **Unit 34** — Multi-select checkbox + floating bulk action bar (Mark Done Selected, Delete Selected)
- [ ]  **Unit 35** — Integrasi Fuse.js — auto-suggestion saat mengetik di form/command `ADD`

### Domain 5: Data Portability

- **Unit 36** — Fitur Export — command `EXPORT` + tombol, download seluruh data jadi `.json`
- **Unit 37** — Fitur Import — command `IMPORT` + tombol, pilih file `.json`, validasi & load ke IndexedDB

### Domain 6: Sync & Auth (Jembatan Frontend-Backend)

- **Unit 38** — UI Login/Register sederhana, simpan JWT token (localStorage/secure storage)
- **Unit 39** — Service sync di frontend — push perubahan lokal ke backend saat online
- **Unit 40** — Pull data dari backend saat login/reconnect, merge ke IndexedDB (last-write-wins)
- **Unit 41** — Indikator status sync di UI (online/offline/syncing) — kecil, tidak mengganggu

### Domain 7: PWA

- **Unit 42** — Setup `vite-plugin-pwa`, buat manifest (nama app, icon, tema warna)
- **Unit 43** — Konfigurasi service worker untuk caching app shell (offline capability)
- **Unit 44** — Test "Add to Home Screen" di Android, verifikasi app tetap jalan tanpa koneksi

**Definition of Done Fase Breakdown:** Semua unit di atas lulus kriteria Definition of Done masing-masing fitur (lihat tabel Fase Planning) secara individual, sebelum lanjut ke Fase Eval.

---

## FASE 4: EVAL

- [ ]  **Unit 45** — Checklist regresi manual: jalankan ulang semua Definition of Done per fitur (dari Fase Planning) secara end-to-end
- [ ]  **Unit 46** — Test skenario offline: matikan koneksi, pastikan semua interaksi (CRUD, command, sort, undo) tetap berfungsi
- [ ]  **Unit 47** — Test skenario sync: edit task di 2 "device" (2 browser/incognito), pastikan last-write-wins bekerja sesuai ekspektasi saat online kembali
- [ ]  **Unit 48** — Test edge case command: ID di luar batas, format command salah, range dengan ID yang sudah dihapus di tengah
- [ ]  **Unit 49** — Test Export → Import round-trip: pastikan data tidak berubah/hilang
- [ ]  **Unit 50** — Self code-review: cek console error/warning, tipe TypeScript ketat (tidak ada `any` yang tidak perlu), struktur folder konsisten

**Requirements :** Tidak ada bug kritis (data hilang, command merusak data tanpa sengaja, app crash). Bug minor boleh dicatat sebagai backlog, tidak wajib memblokir deploy kalau app tetap dipakai layak.

---

## FASE 5: DEPLOY

- [ ]  **Unit 51** — Setup PostgreSQL production di Neon.tech
- [ ]  **Unit 52** — Deploy backend ke Render — konfigurasi environment variables (DB connection string, JWT secret), hubungkan ke Neon
- [ ]  **Unit 53** — Deploy frontend ke Vercel — konfigurasi environment variable (URL backend), verifikasi build PWA (manifest & service worker) jalan di production
- [ ]  **Unit 54** — Smoke test end-to-end di production: register/login, tambah task, sync, install PWA di HP
- [ ]  **Unit 55** — (Opsional) Setup custom domain

---