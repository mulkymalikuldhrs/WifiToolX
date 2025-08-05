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
    const npmInstallCommand = "npm install"
    const pipInstallCommand = "pip install -r requirements.txt"
    const runNextCommand = "npm run dev:next"
    const runPythonCommand = "npm run dev:python"
    
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Command Copied!",
            description: `${label} has been copied to your clipboard.`,
        })
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-headline flex items-center justify-center gap-2"><Terminal/>Local Setup Guide</CardTitle>
                <CardDescription className="text-center">How to run the local terminal server</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Step 1: The Concept</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                           <p>This web UI is a remote control. It sends commands to a Python server (`local_server.py`) running on your machine, which then executes real penetration testing tools.</p>
                           <p>To ensure stability, you'll need to run the web server and the Python server in two separate terminals.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Step 2: Install Dependencies</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                             <p className="text-muted-foreground">First, install the required Node.js and Python packages:</p>
                             <div className="bg-black/50 rounded-md p-3 font-mono text-sm text-primary/80 flex justify-between items-center">
                                <code>{npmInstallCommand}</code>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(npmInstallCommand, "NPM install command")}><Copy className="w-4 h-4"/></Button>
                             </div>
                              <div className="bg-black/50 rounded-md p-3 font-mono text-sm text-primary/80 flex justify-between items-center">
                                <code>{pipInstallCommand}</code>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(pipInstallCommand, "Pip install command")}><Copy className="w-4 h-4"/></Button>
                             </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Step 3: Run The Project</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            <p className="text-muted-foreground">In your first terminal, run the Next.js web application:</p>
                            <div className="bg-black/50 rounded-md p-3 font-mono text-sm text-primary flex justify-between items-center">
                                <code>{runNextCommand}</code>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(runNextCommand, "Run Next.js command")}><Copy className="w-4 h-4"/></Button>
                             </div>
                             <p className="text-muted-foreground">In your second terminal, run the Python local server:</p>
                             <div className="bg-black/50 rounded-md p-3 font-mono text-sm text-cyan-400 flex justify-between items-center">
                                <code>{runPythonCommand}</code>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(runPythonCommand, "Run Python command")}><Copy className="w-4 h-4"/></Button>
                             </div>
                             <p className="text-xs text-destructive/80">Warning: The local Python server executes commands directly on your machine. It is designed for educational purposes in a controlled environment. Do not expose it to untrusted networks.</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-4">
                        <AccordionTrigger>Step 4: Start Attacking</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                           Once both servers are running, click "Full Auto Attack" from the launcher. The UI will connect to your local server, and the daemon will begin its work. You'll see real-time output in the live log panel.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )
}
