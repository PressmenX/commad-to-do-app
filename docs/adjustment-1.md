# 📋 Plan Document — Adjustment 1
### To-Do List App (Command-Based)

Dokumen ini mencatat perubahan dari plan awal (`plan-todolist-app.md`) berdasarkan diskusi lanjutan. Baca berdampingan dengan dokumen plan awal — dokumen ini fokus pada **apa yang berubah dan kenapa**, bukan menulis ulang seluruh plan dari nol.

---

## Ringkasan Perubahan

| Aspek | Sebelum | Sesudah | Alasan |
|---|---|---|---|
| **Struktur ID Task** | ID angka urut sebagai primary key (`1`, `2`, `3`...) | `id` (UUID) sebagai primary key internal + `taskKey` (4 karakter, nanoid + custom alphabet) sebagai identifier yang ditampilkan & dipakai di command | ID urut bermasalah untuk multi-user — task user baru akan melanjutkan angka dari user lain. UUID terlalu panjang untuk diketik manual di command bar |
| **Uniqueness taskKey** | — (belum ada konsep ini) | `taskKey` boleh sama antar user berbeda, tapi wajib unik dalam kombinasi `userId + taskKey` (composite unique constraint) | Sesuai keputusan scope taskKey yang cukup unik per-user, bukan global — lebih simpel dan tetap aman untuk kebutuhan saat ini |
| **Collision handling taskKey** | — (belum ada konsep ini) | Generate taskKey dengan loop cek ke database (`checkTaskKeyExists`); kalau bentrok, generate ulang otomatis — transparan, user tidak pernah melihat proses ini | taskKey digenerate sistem (bukan diketik user), sehingga collision harus ditangani otomatis di belakang layar, bukan dilempar sebagai error ke user |
| **Command `MANY` — dasar range** | Range berdasarkan angka ID (`MD MANY #1-#5`), dengan aturan skip ID yang hilang di tengah | Range berdasarkan **posisi baris di tampilan/array yang sedang aktif** di layar (`MD MANY 1-5`), taskKey spesifik tetap bisa dipakai (`MD MANY #a7x2,#b9k1`) | taskKey bersifat random (bukan angka urut), sehingga konsep "range angka ID" sudah tidak relevan. Posisi array jadi cara paling natural untuk tetap mendukung fitur range |
| **Arsitektur Data** | Offline-first — data utama tersimpan di IndexedDB (lokal), backend hanya untuk fase 2 (sync) | Always-online — semua data langsung ke PostgreSQL lewat REST API, tanpa penyimpanan lokal permanen | User mengonfirmasi tidak ada kebutuhan nyata untuk offline. Kompleksitas offline-sync (conflict resolution, partial sync, dll) tidak sebanding dengan manfaatnya untuk use case ini |
| **IndexedDB / Dexie.js** | Termasuk dalam tech stack MVP | Dihapus dari plan sepenuhnya | Konsekuensi langsung dari keputusan always-online — tidak ada lagi kebutuhan penyimpanan lokal permanen |
| **Endpoint `POST /sync`** | Direncanakan untuk fase 2 | Dihapus dari plan sepenuhnya | Fitur offline-sync dibatalkan, bukan ditunda — endpoint ini jadi tidak relevan |
| **Backend (Nest/Express + Prisma + Postgres)** | Fase 2 (nanti, kalau dibutuhkan sync/multi-device) | **Fase 1 — bagian dari MVP**, dibangun dari awal | Dengan arsitektur always-online, backend jadi kebutuhan inti sejak awal, bukan tambahan opsional |
| **Auth (AuthN/AuthZ)** | Tidak masuk scope, disebut sebagai skill yang dimiliki tapi belum ada rencana implementasi konkret | Masuk sebagai bagian resmi MVP — login & protected route menggunakan JWT/Passport | App sekarang butuh konsep `userId` (untuk scoping taskKey per-user), sehingga auth menjadi kebutuhan fungsional, bukan sekadar nice-to-have. User juga sudah punya modal skill ini, cocok untuk dipraktikkan dalam app nyata |
| **Deploy** | Hanya FE (sudah pernah dilakukan sebelumnya di Vercel) | FE + **BE** (deploy backend ke production — pengalaman baru) | Konsekuensi dari backend masuk fase 1. Sekaligus jadi target belajar baru yang relevan dengan level skill user saat ini |
| **Tujuan Project** | Menyelesaikan masalah pribadi (to-do list custom) | Menyelesaikan masalah pribadi **+ portofolio full-stack pertama** (FE+BE terintegrasi, bukan project terpisah seperti sebelumnya) | User mengonfirmasi tujuan project juga mencakup portofolio dan pengalaman belajar, dengan syarat tetap memakai skill yang sudah dipelajari dan tidak menambah kompleksitas berlebihan |

---

## Fitur yang Dipertimbangkan Tapi Ditolak (dengan Alasan Eksplisit)

| Fitur | Keputusan | Alasan |
|---|---|---|
| Offline-first storage + Sync antar device | ❌ Ditolak | Menambah 1 domain baru (distributed state/conflict resolution) di atas 4 hal baru yang sudah ada di project ini (integrasi FE+BE, deploy backend, auth dalam app nyata, PWA). Beresiko membuat project tidak selesai |
| Riwayat aksi bertingkat (git-style history untuk Undo) | ❌ Ditolak (dari diskusi plan awal) | Kebutuhan belum konkret, Undo 1 langkah terakhir sudah cukup menutup risiko human error |

---

## Yang Tidak Berubah dari Plan Awal

- Struktur kolom task (Task Name, Details, Priority, Category, Status)
- Sistem command (`MD`, `MKDEL`, `DEL`, `ADD MANY`, `UNDO`, `EXPORT`, `IMPORT`)
- Notasi `#` untuk ID/taskKey dan `@` untuk priority
- Dua mode tampilan (Table View & Card View)
- Progress bar & fitur Sort
- Export/Import via file `.json`
- Auto-suggestion basic (fuzzy search dari histori lokal)
- Tech stack frontend: React + TypeScript + Vite + Tailwind + DaisyUI
- PWA capability (install ke home screen Android)