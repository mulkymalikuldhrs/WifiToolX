
import asyncio
import websockets
import subprocess
import shlex
import random

# Security warning: This script executes arbitrary commands and is intended for
# educational purposes in a controlled, local environment.
# Do not expose it to untrusted networks.

async def handler(websocket, path):
    """
    Handles incoming WebSocket connections, executes commands, and streams output.
    """
    client_addr = websocket.remote_address
    print(f"✅ Client connected: {client_addr}")
    try:
        async for message in websocket:
            print(f"-> Received command from {client_addr}: {message}")
            
            # Use shlex to safely split the command string into arguments
            args = shlex.split(message)
            command = args[0] if args else ""

            # --- Command Handling ---
            if command == 'crack_wpa':
                # This is a placeholder for a real cracking function.
                # In a real-world scenario, you would call tools like aircrack-ng,
                # hashcat, etc., using the provided arguments.
                print("   (Simulating WPA crack...)")
                
                # Simulate cracking process with progress updates
                for progress in [25, 50, 75]:
                    await websocket.send(f"CRACK_PROGRESS {progress}")
                    await asyncio.sleep(1) # Simulate work

                # Simulate a 10% chance of success for demonstration
                if random.random() < 0.15: # 15% success chance
                    # In a real implementation, this would be the actual found password
                    password = "password123" 
                    await websocket.send(f"CRACK_SUCCESS {password}")
                    print(f"   (Simulation successful for {client_addr})")
                else:
                    await websocket.send("CRACK_FAILURE")
                    print(f"   (Simulation failed for {client_addr})")
            
            elif command in ['connect_regular', 'connect_mitm']:
                # Placeholder for connection logic
                ssid = args[1] if len(args) > 1 else "unknown network"
                mode = "MITM" if command == 'connect_mitm' else "Regular"
                print(f"   (Simulating {mode} connection to {ssid})")
                await websocket.send(f"Connection to {ssid} in {mode} mode established.")

            else:
                # Generic command execution for other tools (e.g., 'ls', 'ping')
                # This part is highly dangerous if exposed.
                try:
                    print(f"   (Executing generic command: {' '.join(args)})")
                    proc = await asyncio.create_subprocess_exec(
                        *args,
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.STDOUT
                    )
                    
                    # Stream the output back to the client
                    if proc.stdout:
                        while not proc.stdout.at_eof():
                            line = await proc.stdout.readline()
                            if not line:
                                break
                            await websocket.send(line.decode().strip())
                    
                    await proc.wait()
                    print(f"   (Command finished for {client_addr})")

                except FileNotFoundError:
                    await websocket.send(f"Command not found: {command}")
                except Exception as e:
                    await websocket.send(f"Error executing command: {str(e)}")

    except websockets.exceptions.ConnectionClosed as e:
        print(f"❌ Client disconnected: {client_addr} (Code: {e.code}, Reason: {e.reason})")
    except Exception as e:
        print(f"💥 An unexpected error occurred with client {client_addr}: {e}")
    finally:
        print(f"🔌 Connection handler finished for {client_addr}")


async def main():
    """
    Starts the WebSocket server.
    """
    host = "localhost"
    port = 8080
    print(f"🚀 Starting WiFiHunterX local terminal server on ws://{host}:{port}")
    print("   Waiting for the web UI to connect...")
    
    server = await websockets.serve(handler, host, port)
    
    try:
        await server.wait_closed()
    except KeyboardInterrupt:
        print("\nSIGINT received, shutting down server.")
        server.close()
        await server.wait_closed()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server shutdown gracefully.")
