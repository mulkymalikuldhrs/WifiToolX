
import asyncio
import websockets
import subprocess
import shlex
import random
import json
import os
from datetime import datetime

# --- Global Configuration ---
LOGS_DIR = "logs"
SESSIONS_DIR = os.path.join(LOGS_DIR, "sessions")
SUCCESSFUL_PASSWORDS_FILE = os.path.join(LOGS_DIR, "wifi_pass.txt")
SESSION_LOG_FILE = ""

# Security warning: This script executes arbitrary commands and is intended for
# educational purposes in a controlled, local environment.
# Do not expose it to untrusted networks.

def setup_logging():
    """
    Creates necessary directories and sets up the session log file.
    """
    global SESSION_LOG_FILE
    os.makedirs(SESSIONS_DIR, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    SESSION_LOG_FILE = os.path.join(SESSIONS_DIR, f"session_{timestamp}.log")
    
    log_message(f"Starting new session. Log file: {SESSION_LOG_FILE}", console_only=True)

def log_message(message, level="INFO"):
    """
    Logs a message to the console and the current session log file.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted_message = f"[{timestamp}][{level}] {message}"
    
    print(formatted_message) # Print to console
    
    with open(SESSION_LOG_FILE, "a") as f:
        f.write(formatted_message + "\n")

def save_successful_password(ssid, password):
    """
    Saves a successfully cracked password to the dedicated file.
    """
    log_message(f"SUCCESS: Saving password for SSID '{ssid}'.", level="SUCCESS")
    with open(SUCCESSFUL_PASSWORDS_FILE, "a") as f:
        f.write(f"SSID: {ssid}, Password: {password}\n")

async def handler(websocket, path):
    """
    Handles incoming WebSocket connections, executes commands, and streams output.
    """
    client_addr = websocket.remote_address
    log_message(f"Client connected: {client_addr}")
    
    try:
        async for message in websocket:
            log_message(f"Received command from {client_addr}: {message}")
            
            args = shlex.split(message)
            command = args[0] if args else ""

            # --- Command Handling ---
            if command == 'crack_wpa':
                ssid = args[1] if len(args) > 1 else "unknown_ssid"
                log_message(f"Initiating simulated WPA crack for SSID: {ssid}...")
                
                for progress in [25, 50, 75]:
                    await websocket.send(f"CRACK_PROGRESS {progress}")
                    log_message(f"Crack progress for {ssid}: {progress}%")
                    await asyncio.sleep(1)

                if random.random() < 0.15: # 15% success chance
                    password = "password123" 
                    log_message(f"Simulated crack successful for {ssid}. Password: {password}", level="SUCCESS")
                    save_successful_password(ssid, password)
                    await websocket.send(f"CRACK_SUCCESS {password}")
                else:
                    log_message(f"Simulated crack failed for {ssid}.", level="WARN")
                    await websocket.send("CRACK_FAILURE")
            
            elif command in ['connect_regular', 'connect_mitm']:
                ssid = args[1] if len(args) > 1 else "unknown network"
                mode = "MITM" if command == 'connect_mitm' else "Regular"
                log_message(f"Simulating {mode} connection to {ssid}")
                await websocket.send(f"Connection to {ssid} in {mode} mode established.")

            else:
                # This part is highly dangerous if exposed.
                try:
                    log_message(f"Executing generic command: {' '.join(args)}")
                    proc = await asyncio.create_subprocess_exec(
                        *args,
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.STDOUT
                    )
                    
                    if proc.stdout:
                        while not proc.stdout.at_eof():
                            line_bytes = await proc.stdout.readline()
                            if not line_bytes:
                                break
                            line = line_bytes.decode().strip()
                            log_message(f"[CMD_OUTPUT] {line}", level="EXEC")
                            await websocket.send(line)
                    
                    await proc.wait()
                    log_message(f"Command '{' '.join(args)}' finished with code {proc.returncode}.")

                except FileNotFoundError:
                    error_msg = f"Command not found: {command}"
                    log_message(error_msg, level="ERROR")
                    await websocket.send(error_msg)
                except Exception as e:
                    error_msg = f"Error executing command: {str(e)}"
                    log_message(error_msg, level="ERROR")
                    await websocket.send(error_msg)

    except websockets.exceptions.ConnectionClosed as e:
        log_message(f"Client disconnected: {client_addr} (Code: {e.code}, Reason: {e.reason})", level="WARN")
    except Exception as e:
        log_message(f"An unexpected error occurred with client {client_addr}: {e}", level="CRITICAL")
    finally:
        log_message(f"Connection handler finished for {client_addr}")


async def main():
    """
    Starts the WebSocket server.
    """
    setup_logging()
    host = "localhost"
    port = 8080
    log_message(f"Starting WifiToolX local terminal server on ws://{host}:{port}", console_only=True)
    log_message("Waiting for the web UI to connect...", console_only=True)
    
    server = await websockets.serve(handler, host, port)
    
    try:
        await server.wait_closed()
    except KeyboardInterrupt:
        log_message("\nSIGINT received, shutting down server.", console_only=True)
        server.close()
        await server.wait_closed()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer shutdown gracefully.")
