"use client";

import { useState } from "react";
import type { WifiNetwork } from "@/lib/types";
import { getPasswordCandidates } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { KeyRound, ShieldCheck, Loader2 } from "lucide-react";

interface AttackPanelProps {
  network: WifiNetwork;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (password: string) => void;
}

export function AttackPanel({ network, isOpen, onClose, onSuccess }: AttackPanelProps) {
  const [knownInformation, setKnownInformation] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCracking, setIsCracking] = useState(false);
  const [crackProgress, setCrackProgress] = useState(0);
  const [crackedPassword, setCrackedPassword] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await getPasswordCandidates({
      targetName: network.ssid,
      knownInformation,
      passwordHint,
    });
    setIsGenerating(false);

    if ("error" in result) {
      toast({ variant: "destructive", title: "AI Error", description: result.error });
    } else {
      setCandidates(result.passwordCandidates);
    }
  };

  const handleCrack = () => {
    setIsCracking(true);
    setCrackProgress(0);
    setCrackedPassword(null);

    const totalDuration = (Math.random() * 3 + 3) * 1000; // 3-6 seconds
    const interval = 50;
    const steps = totalDuration / interval;
    let currentStep = 0;

    const crackInterval = setInterval(() => {
      currentStep++;
      setCrackProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(crackInterval);
        const successfulPassword = candidates[Math.floor(Math.random() * candidates.length)];
        setCrackedPassword(successfulPassword);
        setIsCracking(false);
        setTimeout(() => {
            onSuccess(successfulPassword);
        }, 1500);
      }
    }, interval);
  };

  const resetState = () => {
    setKnownInformation("");
    setPasswordHint("");
    setCandidates([]);
    setIsGenerating(false);
    setIsCracking(false);
    setCrackProgress(0);
    setCrackedPassword(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetState()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Attacking: {network.ssid}
          </DialogTitle>
          <DialogDescription>
            Use AI to generate password candidates and attempt to crack the network.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="known-info" className="text-right">
              Known Info
            </Label>
            <Textarea
              id="known-info"
              value={knownInformation}
              onChange={(e) => setKnownInformation(e.target.value)}
              className="col-span-3"
              placeholder="e.g., birthdates, pet names, interests"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hint" className="text-right">
              Hint
            </Label>
            <Input
              id="hint"
              value={passwordHint}
              onChange={(e) => setPasswordHint(e.target.value)}
              className="col-span-3"
              placeholder="e.g., contains 'summer' and a year"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleGenerate} disabled={isGenerating || isCracking}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                Generate Candidates
            </Button>
        </DialogFooter>

        {candidates.length > 0 && (
            <div className="mt-4 space-y-4">
                <h4 className="font-semibold">Password Candidates</h4>
                <div className="max-h-32 overflow-y-auto rounded-md border p-2 bg-muted/50 space-y-1">
                    {candidates.map((candidate, i) => (
                        <Badge key={i} variant={crackedPassword === candidate ? "default" : "secondary"} className={cn("font-mono", crackedPassword === candidate && "bg-accent text-accent-foreground")}>
                            {crackedPassword === candidate && <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />}
                            {candidate}
                        </Badge>
                    ))}
                </div>
                {isCracking ? (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Cracking in progress...</p>
                        <Progress value={crackProgress} />
                    </div>
                ) : crackedPassword ? (
                     <div className="text-accent font-semibold flex items-center justify-center p-2 bg-accent/10 rounded-md">
                        <ShieldCheck className="mr-2 h-5 w-5"/>
                        <p>Success! Password is: <span className="font-mono">{crackedPassword}</span>. Connecting...</p>
                    </div>
                ) : (
                    <Button onClick={handleCrack} className="w-full bg-accent hover:bg-accent/90">
                       Start Cracking
                    </Button>
                )}
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
