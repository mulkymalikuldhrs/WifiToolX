
"use client";

import { useState, useEffect } from 'react';
import type { WifiNetwork, ConnectionStatus } from '@/lib/types';
import { getWifiNetworks } from '@/app/actions';

import { Header } from '@/components/header';
import { NetworkList } from '@/components/network-list';
import { AttackPanel } from '@/components/attack-panel';
import { ModeSelectionDialog } from '@/components/mode-selection-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Pause, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManualScanPage() {
    const [networks, setNetworks] = useState<WifiNetwork[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(true);
    const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
    const [isAttackPanelOpen, setIsAttackPanelOpen] = useState(false);
    const [isModeDialogOpen, setIsModeDialogOpen] = useState(false);
    const [connection, setConnection] = useState<ConnectionStatus>({ ssid: null, mode: 'idle' });
    const { toast } = useToast();

    const fetchNetworks = async (currentNetworks: WifiNetwork[] = []) => {
      const result = await getWifiNetworks(currentNetworks);
      if ('error' in result) {
        toast({ variant: 'destructive', title: 'Scan Error', description: result.error });
        setIsLoading(false);
      } else {
        setNetworks(result.networks);
        if (isLoading) setIsLoading(false);
      }
    };
    
    useEffect(() => {
        fetchNetworks(); // Initial scan
    }, []);
    
    useEffect(() => {
        let scanInterval: NodeJS.Timeout;
        if (isScanning) {
            scanInterval = setInterval(() => {
                fetchNetworks(networks);
            }, 5000); 
        }
        return () => clearInterval(scanInterval);
    }, [isScanning, networks]);


    const handleAttack = (network: WifiNetwork) => {
        if (connection.ssid) {
            toast({
                variant: "destructive",
                title: "Already Connected",
                description: `Please disconnect from ${connection.ssid} before attacking another network.`,
            });
            return;
        }
        setSelectedNetwork(network);
        setIsAttackPanelOpen(true);
    };
    
    const handleAttackSuccess = (password: string) => {
        setIsAttackPanelOpen(false);
        // A short delay to appreciate the success message
        setTimeout(() => {
             if (selectedNetwork) {
                setIsModeDialogOpen(true);
            }
        }, 500);
    };

    const handleModeSelection = (mode: 'regular' | 'mitm') => {
        if (selectedNetwork) {
            setConnection({ ssid: selectedNetwork.ssid, mode: mode });
            toast({
                title: "Connection Established",
                description: `Connected to ${selectedNetwork.ssid} in ${mode} mode.`,
            });
        }
        setIsModeDialogOpen(false);
        setSelectedNetwork(null);
    };
    
    const handleDisconnect = () => {
        toast({
            title: "Disconnected",
            description: `You have disconnected from ${connection.ssid}.`,
        });
        setConnection({ ssid: null, mode: 'idle' });
    }

    const renderContent = () => {
      if (isLoading) {
        return (
          <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Scanning for initial networks...</p>
          </div>
        );
      }

      if (networks.length === 0) {
        return (
          <div className="flex flex-col justify-center items-center py-10 text-center">
              <WifiOff className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No networks found.</p>
              <p className="text-sm text-muted-foreground">The backend might be warming up. It should appear in a few seconds.</p>
          </div>
        )
      }

      return <NetworkList networks={networks} onAttack={handleAttack} connectedSsid={connection.ssid}/>;
    }

    return (
        <main className="container mx-auto p-4 sm:p-6 md:p-8">
            <Header connection={connection} onDisconnect={handleDisconnect} />
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold tracking-tight">Available Networks</h2>
                 <Button onClick={() => setIsScanning(!isScanning)} variant="outline" disabled={isLoading}>
                    {isScanning ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
                    {isScanning ? 'Pause Scan' : 'Resume Scan'}
                 </Button>
            </div>
            
            {renderContent()}

            {selectedNetwork && (
                <AttackPanel
                    network={selectedNetwork}
                    isOpen={isAttackPanelOpen}
                    onClose={() => setIsAttackPanelOpen(null)}
                    onSuccess={handleAttackSuccess}
                />
            )}
            
            {selectedNetwork && (
                <ModeSelectionDialog
                  isOpen={isModeDialogOpen}
                  onClose={() => setIsModeDialogOpen(false)}
                  onSelectMode={handleModeSelection}
                  ssid={selectedNetwork.ssid}
                />
            )}
        </main>
    );
}
