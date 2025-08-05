"use client";

import type { WifiNetwork } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Wifi, Signal, SignalLow, SignalMedium, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface NetworkListProps {
  networks: WifiNetwork[];
  onAttack: (network: WifiNetwork) => void;
  connectedSsid: string | null;
}

const SignalStrength = ({ signal }: { signal: number }) => {
  if (signal > -50) return <Signal className="h-5 w-5 text-success" />;
  if (signal > -70) return <SignalMedium className="h-5 w-5 text-yellow-500" />;
  return <SignalLow className="h-5 w-5 text-destructive" />;
};

export function NetworkList({ networks, onAttack, connectedSsid }: NetworkListProps) {
  return (
    <div className="rounded-lg border bg-black/20 backdrop-blur-lg">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-white/10">
            <TableHead className="w-1/3">SSID</TableHead>
            <TableHead className="text-center">Signal</TableHead>
            <TableHead className="text-center">Security</TableHead>
            <TableHead className="text-center">WPS</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {networks.map((network) => (
            <TableRow key={network.bssid} className={cn("border-white/10 hover:bg-white/5", connectedSsid === network.ssid && 'bg-primary/20 hover:bg-primary/20')}>
              <TableCell className="font-medium">{network.ssid}</TableCell>
              <TableCell className="flex justify-center">
                <SignalStrength signal={network.signal} />
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={network.security === 'Open' ? 'destructive' : 'outline'} className="flex items-center gap-1.5 justify-center">
                  {network.security !== 'Open' && <Lock className="w-3 h-3"/>}
                  {network.security}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={network.wps ? "success" : "secondary"}>
                  {network.wps ? "Enabled" : "Disabled"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAttack(network)}
                  disabled={network.security === 'Open' || connectedSsid === network.ssid}
                  aria-label={`Attack ${network.ssid}`}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Attack
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
