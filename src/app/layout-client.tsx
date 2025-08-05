"use client";

import { Inter, Space_Grotesk, Fira_Code } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { BackgroundAnimation } from '@/components/background-animation';
import { Chatbot } from '@/components/chatbot';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

const fontBody = Inter({ subsets: ['latin'], variable: '--font-body' });
const fontHeadline = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline' });
const fontCode = Fira_Code({ subsets: ['latin'], variable: '--font-code' });

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Default to true

  useEffect(() => {
      if (typeof window !== 'undefined') {
          setIsOnline(navigator.onLine);
          const handleOnline = () => setIsOnline(true);
          const handleOffline = () => setIsOnline(false);
          window.addEventListener('online', handleOnline);
          window.addEventListener('offline', handleOffline);
          return () => {
              window.removeEventListener('online', handleOnline);
              window.removeEventListener('offline', handleOffline);
          };
      }
  }, []);

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn("min-h-screen antialiased font-body relative", fontHeadline.variable, fontCode.variable)}>
        <BackgroundAnimation />
        <main className="relative z-10">
          {children}
        </main>
        <Toaster />

        <Button
            onClick={() => setIsChatbotOpen(true)}
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
            aria-label="Open Chatbot"
            disabled={!isOnline}
            variant="default"
          >
            <Bot className="h-8 w-8" />
        </Button>

        <Chatbot 
          isOpen={isChatbotOpen} 
          onClose={() => setIsChatbotOpen(false)} 
          isOnline={isOnline} 
        />
      </body>
    </html>
  );
}
