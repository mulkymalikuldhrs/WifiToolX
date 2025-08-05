# Blueprint Proyek WiFiHunterX

## Pendahuluan
`WiFiHunterX` adalah alat serangan otomatis jaringan WiFi yang dirancang sebagai sistem daemon yang lengkap, modular, dan fleksibel, mampu berjalan offline maupun online, serta dapat dikembangkan ke AI. Proyek ini ditujukan untuk pengujian penetrasi jaringan WiFi secara otomatis dan efisien.

## Struktur Modular
Proyek ini dibangun dengan struktur folder yang terbagi menjadi beberapa modul utama:
- `core/` : Mengelola fungsi dasar seperti scan, attack, dan MITM.
- `data/` : Menyimpan wordlist dan target jaringan.
- `logs/` : Menyimpan log sesi dan hasil sniffing.
- `daemon/` : Skrip otomatis untuk menjalankan proses berulang.
- `configs/` : Pengaturan konfigurasi pengguna.
- `launcher.sh` : Entry point CLI.

## Flow Otomatis
Diagram alur otomatis:
```mermaid
graph TD
    START --> |Scan WiFi| WIFI_SCAN
    WIFI_SCAN --> |WPS tersedia?| WPS_CHECK
    WPS_CHECK --> |Ya| WPS_BRUTE
    WPS_CHECK --> |Tidak| WPA_HANDSHAKE
    WPA_HANDSHAKE --> |Berhasil?|(Ya) --> AUTO_CONNECT
    WPA_HANDSHAKE --> |Gagal?| LOOP_NEXT_TARGET
    AUTO_CONNECT --> |Prompt mode| MODE_PROMPT
    MODE_PROMPT --> |MITM mode?| MITM_MODE
    MITM_MODE --> |Ya| MITM_SNIFF
    MITM_SNIFF --> LOG_SAVE
    LOOP_NEXT_TARGET --> LOG_SAVE
    LOG_SAVE --> RESTART
```

## Daemon Engine
Daemon berjalan otomatis dalam loop:
- Melakukan scan dan deteksi target
- Melakukan brute-force WPS atau capture WPA handshake
- Melakukan percobaan crack password AI
- Koneksi otomatis jika berhasil
- Mode MITM dan logging semua aktivitas
- Berulang secara otomatis sampai target terkoneksi.

## Sistem Logging
Semua aktivitas direkam ke file JSON:
- `logs/sessions/` untuk sesi dan status
- `logs/mitm_captures/` untuk hasil sniffing
- `wifi_pass.txt` sebagai daftar password sukses

## Mode Kerja
- **Offline** : Sistem tidak bergantung internet, lengkap untuk pengujian lokal.
- **Online** : Sinkronisasi ke platform eXternal seperti Telegram, WebDashboard, dll.

## Platform Support
- **Linux (Kali/Debian)** : Instal dependencies via bash script.
- **Termux/Android** : Mendukung environment root, porting ke NetHunter.
- **Portabilitas** : Bisa dijalankan di berbagai platform dengan kompatibilitas tinggi.

## Dependensi Wajib
Berisi instalasi tools seperti `aircrack-ng`, `reaver`, `bully`, `hashcat`, dan library Python terkait.

## Fitur Tambahan
Expansion untuk plugin exploit, phishing UI, analitik GPS, dan plugin AI.

---

Proyek ini dirancang sebagai sistem lengkap, modular, dan mampu berkembang sesuai kebutuhan.  
Sistem otomatis dan logging memastikan keberlanjutan operasi dan pengumpulan data yang lengkap.  
Kendali penuh di tangan pengguna dan pengembang, dilengkapi dengan dokumentasi lengkap.