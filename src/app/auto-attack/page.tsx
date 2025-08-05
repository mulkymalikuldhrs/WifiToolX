
"use client";

import { useState, useEffect, useRef } from 'react';
import type { WifiNetwork, ConnectionStatus } from '@/lib/types';
import { getWifiNetworks } from '@/app/actions';

import { Header } from '@/components/header';
import { NetworkList } from '@/components/network-list';
import { AttackPanel } from '@/components/attack-panel';
import { ModeSelectionDialog } from '@/components/mode-selection-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Pause, WifiOff, Terminal, Wifi, ShieldX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function AutoAttackPage() {
    const [networks, setNetworks] = useState<WifiNetwork[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDaemonRunning, setIsDaemonRunning] = useState(true);
    const [attackedBssids, setAttackedBssids] = useState<Set<string>>(new Set());
    
    const [currentTarget, setCurrentTarget] = useState<WifiNetwork | null>(null);
    const [isAttackPanelOpen, setIsAttackPanelOpen] = useState(false);
    
    const [isModeDialogOpen, setIsModeDialogOpen] = useState(false);
    const [connectedNetwork, setConnectedNetwork] = useState<WifiNetwork | null>(null);
    const [connection, setConnection] = useState<ConnectionStatus>({ ssid: null, mode: 'idle' });
    
    const [logs, setLogs] = useState<string[]>(['Daemon started. Waiting for local terminal server...']);
    const logContainerRef = useRef<HTMLDivElement>(null);
    
    const { toast } = useToast();
    const ws = useRef<WebSocket | null>(null);
    const [isTerminalConnected, setIsTerminalConnected] = useState(false);

    const addLog = (message: string) => {
        setLogs(prev => [...prev.slice(-200), `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        function connect() {
            ws.current = new WebSocket('ws://localhost:8080');

            ws.current.onopen = () => {
                addLog('✅ Terminal server connected.');
                setIsTerminalConnected(true);
            };

            ws.current.onmessage = (event) => {
                addLog(`[TERMINAL] ${event.data}`);
            };

            ws.current.onclose = () => {
                addLog('❌ Terminal server disconnected. Retrying in 5 seconds...');
                setIsTerminalConnected(false);
                setTimeout(connect, 5000);
            };

            ws.current.onerror = (error) => {
                addLog('❌ WebSocket error. Make sure the local server is running.');
                ws.current?.close();
            };
        }
        connect();
        
        return () => {
            ws.current?.close();
        }
    }, []);

    const fetchNetworks = async () => {
        addLog("Scanning for networks...");
        const result = await getWifiNetworks(networks);
        if ('error' in result) {
            addLog(`Scan Error: ${result.error}`);
        } else {
            setNetworks(result.networks);
            addLog(`Scan complete. Found ${result.networks.length} networks.`);
            if (isLoading) setIsLoading(false);
        }
    };
    
    const runAttackCycle = async () => {
        if (!isDaemonRunning || currentTarget || !isTerminalConnected) return;

        await fetchNetworks();

        const nextTarget = networks.find(n => !attackedBssids.has(n.bssid) && n.security !== 'Open');

        if (nextTarget) {
            addLog(`New target selected: ${nextTarget.ssid} (${nextTarget.bssid})`);
            setCurrentTarget(nextTarget);
            setIsAttackPanelOpen(true);
        } else {
            addLog("No new valid targets. Will rescan in 10 seconds.");
            if (isDaemonRunning) {
                setTimeout(runAttackCycle, 10000);
            }
        }
    };

    useEffect(() => {
        if (isDaemonRunning && !currentTarget && isTerminalConnected) {
            const timer = setTimeout(runAttackCycle, 2000); // Initial delay
            return () => clearTimeout(timer);
        }
    }, [isDaemonRunning, networks, currentTarget, attackedBssids, isTerminalConnected]);


    const handleAttackComplete = (password: string | null) => {
        setIsAttackPanelOpen(false);
        if (password && currentTarget) {
            addLog(`SUCCESS! Password for ${currentTarget.ssid} is "${password}".`);
            toast({ title: "Crack Successful!", description: `Password for ${currentTarget.ssid} found!` });
            setIsDaemonRunning(false); 
            setConnectedNetwork(currentTarget);
            setTimeout(() => setIsModeDialogOpen(true), 500);
        } else {
            addLog(`Attack on ${currentTarget?.ssid} failed. Moving to next target.`);
            if (currentTarget) {
                setAttackedBssids(prev => new Set(prev).add(currentTarget.bssid));
            }
        }
        setCurrentTarget(null); // This will trigger the useEffect to find the next target
    };
    
    const handleModeSelection = (mode: 'regular' | 'mitm') => {
        if (connectedNetwork) {
            setConnection({ ssid: connectedNetwork.ssid, mode: mode });
            toast({
                title: "Connection Established",
                description: `Connected to ${connectedNetwork.ssid} in ${mode} mode.`,
            });
             if(ws.current && ws.current.readyState === WebSocket.OPEN) {
                 addLog(`Requesting MITM mode for ${connectedNetwork.ssid}`);
                 ws.current.send(`connect_mitm ${connectedNetwork.ssid}`);
             }
        }
        setIsModeDialogOpen(false);
    };
    
    const handleDisconnect = () => {
        toast({
            title: "Disconnected",
            description: `You have disconnected from ${connection.ssid}.`,
        });
        setConnection({ ssid: null, mode: 'idle' });
        setConnectedNetwork(null);
    }
    
    const renderContent = () => {
      if (!isTerminalConnected) {
         return (
             <div className="flex flex-col justify-center items-center py-10 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Waiting for connection to local terminal server...</p>
                <p className="text-sm text-muted-foreground">Please start the python server on your machine.</p>
            </div>
         )
      }
      
      if (isLoading) {
        return (
          <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Daemon initializing, performing first scan...</p>
          </div>
        );
      }

      if (networks.length === 0 && !isLoading) {
        return (
          <div className="flex flex-col justify-center items-center py-10 text-center">
              <WifiOff className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No networks found.</p>
          </div>
        )
      }

      return <NetworkList networks={networks} onAttack={() => {}} connectedSsid={connection.ssid}/>;
    }

    return (
        <main className="container mx-auto p-4 sm:p-6 md:p-8">
            <Header connection={connection} onDisconnect={handleDisconnect} />
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold tracking-tight">Auto Attack Daemon</h2>
                 <div className="flex items-center gap-4">
                    <Badge variant={isTerminalConnected ? 'default' : 'destructive'} className="gap-2">
                        {isTerminalConnected ? <Wifi className="w-4 h-4"/> : <ShieldX className="w-4 h-4"/>}
                        Terminal {isTerminalConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                     <Button onClick={() => setIsDaemonRunning(!isDaemonRunning)} variant="outline" disabled={isLoading || connection.ssid !== null || !isTerminalConnected}>
                        {isDaemonRunning ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
                        {isDaemonRunning ? 'Pause Daemon' : 'Resume Daemon'}
                     </Button>
                 </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {renderContent()}
                </div>
                <div className="lg:col-span-1 bg-card border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 flex items-center"><Terminal className="mr-2"/>Live Terminal Output</h3>
                    <div ref={logContainerRef} className="h-[400px] bg-black/90 rounded-md p-3 text-sm font-mono text-green-400 overflow-y-auto">
                        {logs.map((log, i) => <p key={i} className="whitespace-pre-wrap leading-tight font-code">{log.startsWith('[TERMINAL]') ? <span className="text-cyan-400">{log}</span> : `> ${log}`}</p>)}
                    </div>
                </div>
            </div>

            {currentTarget && (
                <AttackPanel
                    network={currentTarget}
                    isOpen={isAttackPanelOpen}
                    onClose={() => { /* Cannot be closed manually in daemon mode */ }}
                    onSuccess={handleAttackComplete}
                    isDaemon={true}
                    websocket={ws.current}
                />
            )}
            
            {connectedNetwork && (
                <ModeSelectionDialog
                  isOpen={isModeDialogOpen}
                  onClose={() => setIsModeDialogOpen(false)}
                  onSelectMode={handleModeSelection}
                  ssid={connectedNetwork.ssid}
                />
            )}
        </main>
    );
}
