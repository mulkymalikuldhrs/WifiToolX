import WifiDashboard from '@/components/wifi-dashboard';

export default function Home() {
  return (
    <main className="flex flex-col items-center p-4 sm:p-8 md:p-12">
      <WifiDashboard />
    </main>
  );
}
