import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Bot, Settings, BookText, Wifi } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 md:p-12">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold font-headline mb-2 text-primary flex items-center gap-4">
            <Wifi className="w-12 h-12" /> WiFiHunterX
        </h1>
        <p className="text-lg text-muted-foreground">The Ultimate WiFi Pentest Daemon Tool</p>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-headline">LAUNCHER</CardTitle>
          <CardDescription className="text-center">Select an operational mode</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4">
          <Button asChild size="lg" className="justify-start h-16 text-base">
            <Link href="/auto-attack">
              <Bot className="mr-4 text-primary" />
              <div>
                <p>Full Auto Attack</p>
                <p className="text-xs font-light text-primary-foreground/70">Launch the automated daemon</p>
              </div>
            </Link>
          </Button>
           <Button asChild size="lg" className="justify-start h-16 text-base" disabled>
            <Link href="/manual-scan">
              <List className="mr-4" />
              <div>
                <p>Manual Scan & Attack</p>
                <p className="text-xs font-light text-primary-foreground/70">Find and select targets manually</p>
              </div>
            </Link>
          </Button>
          <Button asChild size="lg" className="justify-start h-16 text-base" disabled>
            <Link href="/setup">
              <Settings className="mr-4" />
               <div>
                <p>Setup & Dependencies</p>
                <p className="text-xs font-light text-primary-foreground/70">Check local tool installation</p>
              </div>
            </Link>
          </Button>
          <Button asChild size="lg" className="justify-start h-16 text-base" disabled>
            <Link href="/logs">
              <BookText className="mr-4" />
              <div>
                <p>View Session Logs</p>
                <p className="text-xs font-light text-primary-foreground/70">Review previous attack results</p>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>
      <footer className="text-center mt-8 text-xs text-muted-foreground">
        <p>This application is intended for authorized security testing only.</p>
        <p>Credit: Mulky Malikul Dhaher</p>
      </footer>
    </main>
  );
}
