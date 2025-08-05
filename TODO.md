# WifiToolX Project Roadmap

This file outlines the planned features and improvements for future releases.

## Core Functionality Enhancements

- [ ] **Implement Real Attack Commands**: Replace the simulated cracking logic in `local_server.py` with actual subprocess calls to penetration testing tools like `aircrack-ng`, `reaver`, or `hashcat`.
- [ ] **Activate Manual Scan & Attack Mode**: Re-enable the "Manual Scan" page, allowing users to view networks and choose a specific target to attack, rather than relying solely on the daemon.
- [ ] **Build Session Log Viewer**: Create the UI for the "View Session Logs" page to allow users to browse, view, and analyze the log files generated during past sessions.
- [ ] **WPS Pin Attack**: Add a specific attack vector for networks with WPS enabled.
- [ ] **Handshake Capture**: Implement functionality to capture WPA/WPA2 handshakes and save them to a file for offline cracking.

## UI/UX Improvements

- [ ] **Settings Page**: Add a configuration page where users can set parameters for attacks, such as timeouts, path to wordlists, or default cracking tool.
- [ ] **Enhanced Visualizations**: Improve the attack panel with more detailed progress indicators, such as hash rates (k/s) or checked password counts.
- [ ] **Notifications**: Add browser notifications for key events, like a successful crack or when the daemon has exhausted all targets.
- [ ] **Dark/Light Mode Toggle**: While the hacker theme is dark by default, a theme toggle could be a nice addition.

## Backend & Security

- [ ] **Secure the WebSocket**: Add a basic token or authentication mechanism to the `local_server.py` to prevent unauthorized connections if the port is accidentally exposed.
- [ ] **Custom Wordlists**: Allow users to specify a path to their own wordlist file to be used in cracking attempts.
- [ ] **Tool Detection**: Have the backend server check if required command-line tools (e.g., `aircrack-ng`) are installed on the host system and report their status to the UI.
