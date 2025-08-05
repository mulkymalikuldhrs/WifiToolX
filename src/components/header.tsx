"use client";

import type { ConnectionStatus } from "@/lib/types";
import { Button } from "./ui/button";
import { Wifi, ShieldAlert, XCircle } from "lucide-react";

interface HeaderProps {
  connection: ConnectionStatus;
  onDisconnect: () => void;
}

export function Header({ connection, onDisconnect }: HeaderProps) {
  return (
    <header className="flex justify-between items-center w-full mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Wifi className="text-primary-foreground w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-headline font-bold">
          WifiToolX
        </h1>
      </div>
      {connection.ssid && (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {connection.mode === 'regular' && <Wifi className="w-4 h-4 text-accent" />}
                {connection.mode === 'mitm' && <ShieldAlert className="w-4 h-4 text-destructive" />}
                <span className="hidden sm:inline">Connected to</span>
                <span className="font-semibold text-foreground">{connection.ssid}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onDisconnect} aria-label="Disconnect">
                <XCircle className="w-5 h-5 text-destructive" />
            </Button>
        </div>
      )}
    </header>
  );
}
