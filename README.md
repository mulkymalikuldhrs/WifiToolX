# 🧠 `WiFiHunterX` – Ultimate WiFi Pentest Daemon Tool

**WiFiHunterX** adalah dasbor antarmuka web yang canggih untuk mengotomatiskan dan mengelola serangan keamanan jaringan WiFi. Proyek ini secara unik menjembatani kenyamanan antarmuka pengguna grafis (GUI) modern dengan kekuatan eksekusi baris perintah (CLI) mentah, memungkinkan pengguna untuk mengontrol alat pentesting yang berjalan di mesin lokal mereka langsung dari browser.

Aplikasi ini bertindak sebagai "pusat komando" untuk **daemon serangan otomatis**, yang secara mandiri memindai jaringan, memilih target, menggunakan AI untuk menghasilkan kata sandi potensial, dan mengirimkan perintah serangan nyata ke server terminal lokal melalui WebSocket.

---

## 🔩 FUNGSI UTAMA

| Komponen                 | Fungsi                                                                       |
| ------------------------ | ---------------------------------------------------------------------------- |
| **Antarmuka Web Modern** | Dasbor berbasis Next.js & React dengan desain *glassmorphism* untuk kontrol visual. |
| **Daemon Otomatis**      | Mode serangan "jalankan dan lupakan" yang secara otomatis menargetkan jaringan.   |
| **Integrasi Terminal**   | Terhubung ke server Python lokal melalui WebSocket untuk eksekusi perintah nyata. |
| **AI Password Generation** | Menggunakan Genkit dan model AI Google untuk menghasilkan kandidat kata sandi cerdas. |
| **Visualisasi Real-time**| Pantau jaringan yang ditemukan dan lihat log langsung dari terminal lokal Anda.    |
| **Mode Koneksi Ganda**   | Setelah berhasil, pilih antara mode koneksi regular atau MITM (Man-in-the-Middle). |
| **Alur Kerja Otomatis**  | Secara otomatis beralih ke target berikutnya jika serangan gagal, memastikan operasi berkelanjutan. |
| **Penyiapan Terpadu**    | Server frontend dan backend lokal dapat dijalankan bersamaan dengan satu perintah (`npm run dev`). |

---

## 🔄 ALUR KERJA APLIKASI

1.  **Inisialisasi**: Pengguna menjalankan `npm run dev`, yang memulai aplikasi web Next.js dan server terminal Python lokal secara bersamaan.
2.  **Koneksi**: Aplikasi web secara otomatis mencoba untuk terhubung ke server terminal lokal melalui WebSocket.
3.  **Mulai Daemon**: Setelah terhubung, halaman "Auto Attack" memulai siklus daemon:
    *   Meminta daftar jaringan WiFi dari backend.
    *   Memilih target yang valid dan belum pernah diserang.
    *   Membuka panel serangan.
4.  **Serangan**:
    *   Aplikasi web memanggil AI untuk menghasilkan kandidat kata sandi berdasarkan SSID target.
    *   Perintah `crack_wpa` (disertai kandidat kata sandi) dikirim ke server terminal lokal.
5.  **Hasil**:
    *   **Berhasil**: Jika terminal melaporkan keberhasilan, pengguna akan diminta untuk memilih mode koneksi (Regular/MITM). Daemon dijeda.
    *   **Gagal**: Jika gagal, daemon akan menandai target sebagai sudah dicoba dan secara otomatis beralih ke target berikutnya.
6.  **Logging**: Semua output dari terminal lokal ditampilkan secara real-time di antarmuka web.
