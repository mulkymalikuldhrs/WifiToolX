
"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Terminal, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "./ui/button"

export function SetupTutorial() {
    const { toast } = useToast()
    const pythonCode = `
import asyncio
import websockets
import subprocess
import shlex

async def handler(websocket):
    print(f"🔗 Client connected!")
    try:
        async for message in websocket:
            print(f"-> Received command: {message}")
            # Security warning: shlex.split is safer than message.split() but executing
            # arbitrary commands is still dangerous. This is for a controlled environment.
            args = shlex.split(message)
            
            # Example command handling
            if args[0] == 'crack_wpa':
                # This is a placeholder for a real cracking function
                # In a real scenario, you'd call aircrack-ng, hashcat, etc.
                print("Simulating WPA crack...")
                await websocket.send("CRACK_PROGRESS 25")
                await asyncio.sleep(1)
                await websocket.send("CRACK_PROGRESS 50")
                await asyncio.sleep(1)
                # Simulate a 10% chance of success
                import random
                if random.random() < 0.1:
                    password = "password123" # Dummy password
                    await websocket.send(f"CRACK_SUCCESS {password}")
                else:
                    await websocket.send("CRACK_FAILURE")

            else:
                # Generic command execution
                with subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True) as proc:
                    for line in proc.stdout:
                        await websocket.send(line.strip())
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected.")
    finally:
        print("Connection handler finished.")


async def main():
    print("🚀 Starting WebSocket server on ws://localhost:8080")
    async with websockets.serve(handler, "localhost", 8080):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())

`
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to clipboard!",
        })
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-headline flex items-center justify-center gap-2"><Terminal/>Local Setup</CardTitle>
                <CardDescription className="text-center">How to connect this UI to your terminal</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Step 1: The Concept</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            This web UI acts as a remote control. It sends commands to a simple Python server running on your local machine. This server then executes penetration testing tools like Aircrack-ng for you.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Step 2: Install Dependencies</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                             <p className="text-muted-foreground">You need Python 3 and the 'websockets' library. Open your terminal and run:</p>
                             <pre className="bg-black/80 rounded-md p-3 text-sm font-mono text-green-400 overflow-x-auto text-wrap flex justify-between items-center">
                                <code>pip install websockets</code>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard('pip install websockets')}><Copy className="w-4 h-4"/></Button>
                             </pre>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Step 3: Run The Local Server</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            <p className="text-muted-foreground">Save the code below as a Python file (e.g., `server.py`) on your machine and run it from your terminal with `python server.py`.</p>
                             <div className="relative">
                                <pre className="bg-black/80 rounded-md p-3 text-sm font-mono text-cyan-400 overflow-y-auto max-h-60 text-wrap">
                                    <code>{pythonCode}</code>
                                </pre>
                                 <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => copyToClipboard(pythonCode)}><Copy className="w-4 h-4"/></Button>
                            </div>
                            <p className="text-xs text-destructive/80">Warning: This script is designed for educational purposes in a controlled environment. Do not expose it to untrusted networks.</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-4">
                        <AccordionTrigger>Step 4: Start Attacking</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                           Once the server is running, click "Full Auto Attack" from the launcher. The UI will connect to your local server, and you'll see terminal output in the live log on the next page.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )
}
