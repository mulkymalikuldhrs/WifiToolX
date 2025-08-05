import type { Metadata } from 'next';
import RootLayoutClient from './layout-client';

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
    <RootLayoutClient>
        {children}
    </RootLayoutClient>
  );
}
