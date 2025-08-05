
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
    const npmCommand = "npm install"
    const runCommand = "npm run dev"
    
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
                <CardDescription className="text-center">How to run the local terminal server</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Step 1: The Concept</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            This web UI acts as a remote control. It sends commands to a simple Python server running on your local machine. This server then executes penetration testing tools like Aircrack-ng for you. The Python server is now integrated to run automatically with the project.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Step 2: Install Dependencies</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                             <p className="text-muted-foreground">First, ensure all Node.js and Python dependencies are installed. You will need Python 3 and Node.js on your system. Run this command in your project's root directory:</p>
                             <pre className="bg-black/80 rounded-md p-3 text-sm font-mono text-green-400 overflow-x-auto text-wrap flex justify-between items-center">
                                <code>{npmCommand}</code>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(npmCommand)}><Copy className="w-4 h-4"/></Button>
                             </pre>
                             <p className="text-muted-foreground mt-2">This will install the required Node packages (like Next.js and `npm-run-all`) and the Python library (`websockets`) needed for the local server.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Step 3: Run The Project</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            <p className="text-muted-foreground">Now, simply run the main development command. This single command will start both the Next.js web application and the Python local terminal server simultaneously.</p>
                             <pre className="bg-black/80 rounded-md p-3 text-sm font-mono text-green-400 overflow-x-auto text-wrap flex justify-between items-center">
                                <code>{runCommand}</code>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(runCommand)}><Copy className="w-4 h-4"/></Button>
                             </pre>
                             <p className="text-xs text-destructive/80">Warning: The local Python server is designed for educational purposes in a controlled environment. Do not expose it to untrusted networks.</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-4">
                        <AccordionTrigger>Step 4: Start Attacking</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                           Once the servers are running, click "Full Auto Attack" from the launcher. The UI will automatically connect to your local Python server, and you'll see real terminal output in the live log on the next page.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )
}
