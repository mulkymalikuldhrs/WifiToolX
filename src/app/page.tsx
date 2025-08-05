import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Bot, BookText, Wifi } from 'lucide-react';
import { SetupTutorial } from '@/components/setup-tutorial';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 md:p-12">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold font-headline mb-2 text-primary flex items-center justify-center gap-4">
            <Wifi className="w-12 h-12" /> WiFiHunterX
        </h1>
        <p className="text-lg text-muted-foreground">The Ultimate WiFi Pentest Daemon Tool</p>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-headline">LAUNCHER</CardTitle>
            <CardDescription className="text-center">Select an operational mode</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-4">
            <Button asChild size="lg" className="justify-start h-20 text-base">
              <Link href="/auto-attack">
                <Bot className="mr-4 text-primary w-8 h-8" />
                <div>
                  <p className="font-bold text-lg">Full Auto Attack</p>
                  <p className="text-xs font-light text-primary-foreground/70">Launch the automated daemon for autonomous pentesting.</p>
                </div>
              </Link>
            </Button>
            <Button asChild size="lg" className="justify-start h-20 text-base" disabled>
              <Link href="/manual-scan">
                <List className="mr-4 w-8 h-8" />
                <div>
                  <p className="font-bold text-lg">Manual Scan & Attack</p>
                  <p className="text-xs font-light text-primary-foreground/70">Manually find and select specific targets. (Coming Soon)</p>
                </div>
              </Link>
            </Button>
             <Button asChild size="lg" className="justify-start h-20 text-base" disabled>
              <Link href="/logs">
                <BookText className="mr-4 w-8 h-8" />
                <div>
                  <p className="font-bold text-lg">View Session Logs</p>
                  <p className="text-xs font-light text-primary-foreground/70">Review results from previous sessions. (Coming Soon)</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
        <div className="w-full">
            <SetupTutorial />
        </div>
      </div>
      <footer className="text-center mt-12 text-xs text-muted-foreground">
        <p>This application is intended for authorized security testing and educational purposes only.</p>
        <p>Credit: <a href="https://github.com/mulkymalikuldhrs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mulky Malikul Dhaher</a>. View Project on <a href="https://github.com/mulkymalikuldhrs/WifiToolX" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.</p>
      </footer>
    </main>
  );
}
