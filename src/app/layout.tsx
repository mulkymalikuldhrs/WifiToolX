import type {Metadata} from 'next';
import { Inter, Space_Grotesk, Fira_Code } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const fontBody = Inter({ subsets: ['latin'], variable: '--font-body' });
const fontHeadline = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline' });
const fontCode = Fira_Code({ subsets: ['latin'], variable: '--font-code' });


export const metadata: Metadata = {
  title: 'WiFiHunterX',
  description: 'Advanced WiFi Security Auditing Tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn("min-h-screen antialiased font-body", fontHeadline.variable, fontCode.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
