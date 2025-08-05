
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Target, Wifi, Signal, SignalLow, SignalMedium, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NetworkListProps {
  networks: WifiNetwork[];
  onManualAttack: (network: WifiNetwork) => void;
  connectedSsid: string | null;
  attackedBssids: Set<string>;
}

const SignalStrength = ({ signal }: { signal: number }) => {
  if (signal > -50) return <Signal className="h-5 w-5 text-success" />;
  if (signal > -70) return <SignalMedium className="h-5 w-5 text-yellow-500" />;
  return <SignalLow className="h-5 w-5 text-destructive" />;
};

export function NetworkList({ networks, onManualAttack, connectedSsid, attackedBssids }: NetworkListProps) {
  return (
    <div className="rounded-lg border border-primary/20 bg-black/30 backdrop-blur-lg">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-primary/20">
            <TableHead className="w-1/3">SSID</TableHead>
            <TableHead className="text-center">Signal</TableHead>
            <TableHead className="text-center">Security</TableHead>
            <TableHead className="text-center">WPS</TableHead>
            <TableHead className="text-right pr-6">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {networks.map((network) => {
            const isAttacked = attackedBssids.has(network.bssid);
            const isConnected = connectedSsid === network.ssid;
            const isOpen = network.security === 'Open';

            return (
                <TableRow key={network.bssid} className={cn("border-b-primary/10 hover:bg-primary/10", isConnected && 'bg-primary/20 hover:bg-primary/20')}>
                <TableCell className="font-medium">{network.ssid}</TableCell>
                <TableCell className="flex justify-center items-center h-14">
                    <SignalStrength signal={network.signal} />
                </TableCell>
                <TableCell className="text-center">
                    <Badge variant={isOpen ? 'destructive' : 'outline'} className="flex items-center gap-1.5 justify-center">
                    {!isOpen && <Lock className="w-3 h-3"/>}
                    {network.security}
                    </Badge>
                </TableCell>
                <TableCell className="text-center">
                    <Badge variant={network.wps ? "success" : "secondary"}>
                    {network.wps ? "Enabled" : "Disabled"}
                    </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                 <div className="flex justify-end">
                                    {isAttacked ? (
                                        <Badge variant="secondary" className="gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5"/>
                                            Attacked
                                        </Badge>
                                    ) : (
                                        <Badge variant={isOpen || isConnected ? 'secondary' : 'default'} className="gap-1.5">
                                            {isOpen ? 'Open' : 'Ready'}
                                        </Badge>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {isAttacked ? <p>This network has already been targeted by the daemon.</p> :
                                 isOpen ? <p>This network is open and does not require cracking.</p> :
                                 isConnected ? <p>You are currently connected to this network.</p> :
                                 <p>This network is a valid target for the daemon.</p>
                                }
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TableCell>
                </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
