# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-05

### Added

- **Initial Release of WiFiHunterX**
- **Modern Web UI**: Built with Next.js, React, ShadCN, and Tailwind CSS, featuring a "glassmorphism" hacker-themed design.
- **Auto Attack Daemon**: Autonomous mode that scans for networks, selects valid targets, and initiates attacks without user intervention.
- **Real-time Terminal Integration**: Connects to a local Python WebSocket server to execute commands and stream live terminal output directly to the web UI.
- **AI Password Generation**: Utilizes Genkit and Google AI models to intelligently generate password candidates based on network SSID and other hints.
- **Persistent Logging**: Automatically creates a `logs/` directory. Saves detailed session activity in `logs/sessions/` and stores successfully cracked passwords in `logs/wifi_pass.txt`.
- **Integrated Development Environment**: Simplified `npm run dev` command to run both the Next.js frontend and the Python backend server concurrently.
- **Full Project Documentation**: Comprehensive `README.md` including architecture overview, workflow, and setup instructions.
- **Dependency Management**: Clear `package.json` for Node.js dependencies and `requirements.txt` for Python dependencies.
