# 🧠 WifiToolX — Ultimate WiFi Pentest Daemon Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3-3776AB)](https://python.org/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-purple.svg)](https://ai.google/)

---

## 🇬🇧 English

WifiToolX is a sophisticated web interface dashboard for automating and managing WiFi network security testing. The project uniquely bridges the convenience of a modern graphical user interface (GUI) with the raw power of command-line execution, allowing users to control pentesting tools running on their local machine directly from the browser.

The application acts as a "command center" for an **automated attack daemon** that independently scans networks, selects targets, uses AI to generate potential passwords, and sends real attack commands to the local terminal server via WebSocket.

### Key Features
- **Modern Web Interface**: Next.js & React dashboard with glassmorphism design
- **Automated Daemon**: "Fire and forget" attack mode that automatically targets networks
- **Terminal Integration**: Connected to local Python server via WebSocket for real command execution
- **AI Password Generation**: Uses Genkit and Google AI models for intelligent password candidates
- **Real-time Visualization**: Monitor discovered networks and live terminal logs
- **Persistent Logging**: Auto-saves session logs and successful passwords

### Architecture
1. **Frontend (Client)**: Next.js/React web app running in your browser
2. **Backend (Local Server)**: Python WebSocket server (`local_server.py`) with pentesting tool execution

### Setup

```bash
git clone https://github.com/mulkymalikuldhrs/WifiToolX.git
cd WifiToolX
npm install
pip install -r requirements.txt

# Terminal 1 - Web UI
npm run dev

# Terminal 2 - Local Server
python3 local_server.py
```

Open `http://localhost:9002`

---

## 🇮🇩 Bahasa Indonesia

WifiToolX adalah dasbor antarmuka web yang canggih untuk mengotomatiskan dan mengelola serangan keamanan jaringan WiFi. Proyek ini menjembatani kenyamanan GUI modern dengan kekuatan eksekusi CLI, memungkinkan pengguna mengontrol alat pentesting dari browser.

### Fitur Utama
- **Antarmuka Web Modern**: Dasbor Next.js & React dengan desain glassmorphism
- **Daemon Otomatis**: Mode serangan "jalankan dan lupakan"
- **Integrasi Terminal**: Terhubung ke server Python lokal via WebSocket
- **AI Password Generation**: Menggunakan Genkit dan Google AI
- **Visualisasi Real-time**: Pantau jaringan dan log terminal langsung
- **Logging Persisten**: Simpan log sesi dan kata sandi berhasil

### Arsitektur
1. **Frontend**: Aplikasi web Next.js/React
2. **Backend**: Server WebSocket Python dengan eksekusi alat pentesting

---

## 🇨🇳 中文

WifiToolX 是一个复杂的Web界面仪表板，用于自动化和管理WiFi网络安全测试。该项目将现代GUI的便利性与命令行执行的强大功能相结合，用户可以直接从浏览器控制本地机器上运行的渗透测试工具。

### 主要功能
- **现代Web界面**: Next.js & React 仪表板，玻璃拟态设计
- **自动守护进程**: "启动即忘"攻击模式
- **终端集成**: 通过WebSocket连接到本地Python服务器
- **AI密码生成**: 使用Genkit和Google AI模型
- **实时可视化**: 监控发现的网络和实时终端日志
- **持久日志**: 自动保存会话日志和成功密码

---

## ⚠️ Disclaimer

**For Education Purpose Only.** All content, code, and documentation provided in this repository are intended solely for educational and research purposes. Nothing in this repository constitutes financial, investment, legal, or professional advice. The authors and contributors assume no responsibility or liability for any losses, damages, or consequences arising from the use of this software or information provided herein.

**Hanya untuk Tujuan Pendidikan.** Semua konten, kode, dan dokumentasi dalam repositori ini hanya ditujukan untuk tujuan pendidikan dan penelitian. Penulis dan kontributor tidak bertanggung jawab atas risiko atau kerugian apa pun yang timbul dari penggunaan perangkat lunak atau informasi yang disediakan.

**仅用于教育目的。** 本仓库中的所有内容、代码和文档仅用于教育和研究目的。作者和贡献者对因使用本软件或提供的信息而造成的任何损失、损害或后果不承担任何责任。

---

## 📬 Contact

**Mulky Malikul Dhaher** — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)

GitHub: [https://github.com/mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Copyright © 2026 Mulky Malikul Dhaher. All rights reserved.
