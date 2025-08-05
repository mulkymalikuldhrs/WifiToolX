"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Shield, Wifi } from "lucide-react";

interface ModeSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: "regular" | "mitm") => void;
  ssid: string;
}

export function ModeSelectionDialog({
  isOpen,
  onClose,
  onSelectMode,
  ssid,
}: ModeSelectionDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl">Connection Successful</AlertDialogTitle>
          <AlertDialogDescription>
            You are now connected to <span className="font-bold text-foreground">{ssid}</span>. Please select your operational mode.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <Button variant="secondary" size="lg" className="h-20 flex-col gap-2" onClick={() => onSelectMode('regular')}>
                <Wifi className="w-6 h-6"/>
                Regular Usage
                <p className="font-normal text-xs text-muted-foreground">Standard internet access</p>
            </Button>
            <Button variant="destructive" size="lg" className="h-20 flex-col gap-2" onClick={() => onSelectMode('mitm')}>
                <Shield className="w-6 h-6"/>
                Man-in-the-Middle
                <p className="font-normal text-xs text-muted-foreground">Monitor network traffic</p>
            </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
