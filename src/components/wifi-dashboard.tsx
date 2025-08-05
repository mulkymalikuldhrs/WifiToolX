"use client";

import { useState, useReducer, useEffect, useCallback } from "react";
import type { WifiNetwork, ConnectionStatus } from "@/lib/types";
import { generateDummyNetworks } from "@/lib/dummy-data";
import { useToast } from "@/hooks/use-toast";

import { Header } from "@/components/header";
import { NetworkList } from "@/components/network-list";
import { AttackPanel } from "@/components/attack-panel";
import { ModeSelectionDialog } from "@/components/mode-selection-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RotateCw, Zap, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type State = {
  isScanning: boolean;
  networks: WifiNetwork[];
  selectedNetwork: WifiNetwork | null;
  connection: ConnectionStatus;
  isDaemonMode: boolean;
};

type Action =
  | { type: "START_SCAN" }
  | { type: "FINISH_SCAN"; payload: WifiNetwork[] }
  | { type: "SELECT_NETWORK"; payload: WifiNetwork | null }
  | { type: "SET_CONNECTION"; payload: ConnectionStatus }
  | { type: "DISCONNECT" }
  | { type: "TOGGLE_DAEMON_MODE" };

const initialState: State = {
  isScanning: false,
  networks: [],
  selectedNetwork: null,
  connection: { ssid: null, mode: "idle" },
  isDaemonMode: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_SCAN":
      return { ...state, isScanning: true };
    case "FINISH_SCAN":
      return { ...state, isScanning: false, networks: action.payload };
    case "SELECT_NETWORK":
      return { ...state, selectedNetwork: action.payload };
    case "SET_CONNECTION":
      return { ...state, connection: action.payload, selectedNetwork: null };
    case "DISCONNECT":
      return { ...state, connection: { ssid: null, mode: "idle" } };
    case "TOGGLE_DAEMON_MODE":
      return { ...state, isDaemonMode: !state.isDaemonMode, networks: !state.isDaemonMode ? state.networks : [] };
    default:
      return state;
  }
}

export default function WifiDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isModeSelectionOpen, setModeSelectionOpen] = useState(false);
  const { toast } = useToast();

  const handleScan = useCallback(() => {
    dispatch({ type: "START_SCAN" });
    setTimeout(() => {
      const newNetworks = generateDummyNetworks(state.networks);
      dispatch({ type: "FINISH_SCAN", payload: newNetworks });
    }, 2000);
  }, [state.networks]);
  
  useEffect(() => {
    if (state.isDaemonMode && !state.isScanning && !state.selectedNetwork) {
      const id = setInterval(handleScan, 10000);
      return () => clearInterval(id);
    }
  }, [state.isDaemonMode, state.isScanning, state.selectedNetwork, handleScan]);


  const handleAttack = (network: WifiNetwork) => {
    if (state.connection.ssid) {
      toast({
        variant: "destructive",
        title: "Already Connected",
        description: "Please disconnect before attacking another network.",
      });
      return;
    }
    dispatch({ type: "SELECT_NETWORK", payload: network });
  };

  const handleCrackSuccess = (password: string) => {
    if (!state.selectedNetwork) return;

    toast({
      title: "Password Cracked!",
      description: `Successfully found password for ${state.selectedNetwork.ssid}.`,
    });
    
    setTimeout(() => {
        dispatch({
            type: "SET_CONNECTION",
            payload: { ssid: state.selectedNetwork!.ssid, mode: "idle" },
        });
        setModeSelectionOpen(true);
    }, 500);

  };

  const handleModeSelect = (mode: "regular" | "mitm") => {
    dispatch({
      type: "SET_CONNECTION",
      payload: { ssid: state.connection.ssid, mode: mode },
    });
    toast({
      title: "Mode Selected",
      description: `Switched to ${mode === "regular" ? "Regular Usage" : "MITM"} mode.`,
    });
    setModeSelectionOpen(false);
  };
  
  const handleDisconnect = () => {
    dispatch({ type: 'DISCONNECT' });
    toast({
      title: 'Disconnected',
      description: 'You have been disconnected from the network.',
    });
  };


  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Header connection={state.connection} onDisconnect={handleDisconnect} />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
                 <Button onClick={handleScan} disabled={state.isScanning}>
                    <RotateCw className={`mr-2 h-4 w-4 ${state.isScanning ? 'animate-spin' : ''}`} />
                    {state.isScanning ? "Scanning..." : "Scan Networks"}
                </Button>
                <div className="flex items-center space-x-2">
                    <Switch 
                        id="daemon-mode" 
                        checked={state.isDaemonMode} 
                        onCheckedChange={() => dispatch({ type: 'TOGGLE_DAEMON_MODE' })}
                        aria-label="Toggle daemon mode"
                    />
                    <Label htmlFor="daemon-mode" className="font-light">Daemon Mode</Label>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          {state.isScanning && state.networks.length === 0 ? (
             <div className="space-y-4 mt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
             </div>
          ) : state.networks.length > 0 ? (
            <NetworkList
              networks={state.networks}
              onAttack={handleAttack}
              connectedSsid={state.connection.ssid}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="mx-auto h-12 w-12" />
              <p className="mt-4">No networks found. Start a scan to find nearby WiFi networks.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {state.selectedNetwork && (
        <AttackPanel
          network={state.selectedNetwork}
          isOpen={!!state.selectedNetwork}
          onClose={() => dispatch({ type: "SELECT_NETWORK", payload: null })}
          onSuccess={handleCrackSuccess}
        />
      )}

      {state.connection.ssid && (
          <ModeSelectionDialog
            isOpen={isModeSelectionOpen}
            onClose={() => setModeSelectionOpen(false)}
            onSelectMode={handleModeSelect}
            ssid={state.connection.ssid}
          />
      )}
    </div>
  );
}
