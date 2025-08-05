import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Bot } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 md:p-12">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold font-headline mb-2">🔫 WiFiHunterX</h1>
        <p className="text-lg text-muted-foreground">All-in-One WiFi Attack Tool</p>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">MENU</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild size="lg" className="justify-start" disabled>
            <Link href="/manual-scan">
              <List className="mr-2" />
              Jalankan Scan Manual
            </Link>
          </Button>
          <Button asChild size="lg" className="justify-start">
            <Link href="/auto-attack">
              <Bot className="mr-2" />
              Full Auto Attack (Daemon)
            </Link>
          </Button>
          <Button asChild size="lg" className="justify-start" disabled>
            <Link href="/setup">
              <List className="mr-2" />
              Setup & Install Dependencies
            </Link>
          </Button>
          <Button asChild size="lg" className="justify-start" disabled>
            <Link href="/logs">
              <List className="mr-2" />
              Buka Log Terakhir
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
