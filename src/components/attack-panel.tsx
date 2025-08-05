
"use client";

import { useState, useEffect } from "react";
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
import { KeyRound, ShieldCheck, Loader2, ShieldX, Terminal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttackPanelProps {
  network: WifiNetwork;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (password: string | null) => void;
  isDaemon?: boolean;
  websocket: WebSocket | null;
}

export function AttackPanel({ network, isOpen, onClose, onSuccess, isDaemon = false, websocket }: AttackPanelProps) {
  const [knownInformation, setKnownInformation] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCracking, setIsCracking] = useState(false);
  const [crackProgress, setCrackProgress] = useState(0);
  const [attackResult, setAttackResult] = useState<'success' | 'fail' | null>(null);
  const [crackedPassword, setCrackedPassword] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [equivalentCommand, setEquivalentCommand] = useState<string>("");

  useEffect(() => {
    // Auto-start generation in daemon mode
    if (isDaemon && isOpen) {
        handleGenerate();
    }
  }, [isDaemon, isOpen]);


  const handleGenerate = async () => {
    setIsGenerating(true);
    setCandidates([]);
    setAttackResult(null);
    setCrackedPassword(null);
    setEquivalentCommand("");

    const result = await getPasswordCandidates({
      targetName: network.ssid,
      knownInformation,
      passwordHint,
    });
    setIsGenerating(false);

    if ("error" in result) {
      toast({ variant: "destructive", title: "AI Error", description: result.error });
      if (isDaemon) {
          setTimeout(() => onSuccess(null), 1500);
      }
    } else {
      const wordlistFileName = `temp_wordlist_${network.bssid.replace(/:/g, '')}.txt`;
      const command = `crack_wpa "${network.bssid}" "${network.channel}" "${result.passwordCandidates.join(',')}"`;
      setEquivalentCommand(command);
      setCandidates(result.passwordCandidates);
      if (isDaemon) {
        handleCrack(command, result.passwordCandidates);
      }
    }
  };

  const handleCrack = (command: string, generatedCandidates: string[]) => {
    if (generatedCandidates.length === 0) {
      if (isDaemon) onSuccess(null);
      return;
    }
    
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        setIsCracking(true);
        setAttackResult(null);
        websocket.send(command);
        
        const messageListener = (event: MessageEvent) => {
            const data = event.data.toString();
            if(data.startsWith("CRACK_PROGRESS")) {
                const progress = parseInt(data.split(" ")[1], 10);
                setCrackProgress(progress);
            } else if (data.startsWith("CRACK_SUCCESS")) {
                const password = data.substring(data.indexOf(" ") + 1);
                setCrackedPassword(password);
                setAttackResult('success');
                setIsCracking(false);
                setTimeout(() => onSuccess(password), 2000);
                websocket.removeEventListener('message', messageListener);
            } else if (data.startsWith("CRACK_FAILURE")) {
                setAttackResult('fail');
                setIsCracking(false);
                setTimeout(() => onSuccess(null), 2000);
                websocket.removeEventListener('message', messageListener);
            }
        };

        websocket.addEventListener('message', messageListener);

    } else {
        toast({ variant: "destructive", title: "Connection Error", description: "WebSocket is not connected to the terminal server." });
        if(isDaemon) onSuccess(null);
    }
  };

  const resetState = () => {
    setKnownInformation("");
    setPasswordHint("");
    setCandidates([]);
    setIsGenerating(false);
    setIsCracking(false);
    setCrackProgress(0);
    setCrackedPassword(null);
    setAttackResult(null);
    setEquivalentCommand("");
    onClose();
  }

  const renderCrackStatus = () => {
    if (isCracking) {
      return (
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Cracking in progress... Relaying to local terminal.</p>
            <Progress value={crackProgress} />
        </div>
      );
    }
    if (attackResult === 'success') {
      return (
        <div className="text-accent font-semibold flex items-center justify-center p-2 bg-accent/10 rounded-md">
            <ShieldCheck className="mr-2 h-5 w-5"/>
            <p>Success! Password is: <span className="font-mono">{crackedPassword}</span>. Connecting...</p>
        </div>
      );
    }
    if (attackResult === 'fail') {
      return (
        <div className="text-destructive font-semibold flex items-center justify-center p-2 bg-destructive/10 rounded-md">
            <ShieldX className="mr-2 h-5 w-5"/>
            <p>Attack failed. No valid password found by local terminal.</p>
        </div>
      )
    }
    return (
        <Button onClick={() => handleCrack(equivalentCommand, candidates)} className="w-full bg-accent hover:bg-accent/90" disabled={!equivalentCommand || !websocket}>
            <Zap className="mr-2"/>
            Execute Attack in Terminal
        </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isDaemon && resetState()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Attacking: {network.ssid}
          </DialogTitle>
           {isDaemon ? (
             <DialogDescription>
                Daemon is automatically attacking via the local terminal. Process cannot be interrupted.
             </DialogDescription>
           ) : (
            <DialogDescription>
                Use AI to generate candidates, then execute the cracking command in your local terminal.
            </DialogDescription>
           )}
        </DialogHeader>

        {!isDaemon && (
         <>
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
         </>
        )}
        
        {isGenerating && !isDaemon && (
             <div className="flex justify-center items-center p-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <p>AI is generating candidates...</p>
            </div>
        )}

        {candidates.length > 0 && (
            <div className="mt-4 space-y-4">
                <h4 className="font-semibold">Password Candidates ({candidates.length})</h4>
                <div className="max-h-32 overflow-y-auto rounded-md border p-2 bg-muted/50 space-y-1">
                    {candidates.map((candidate, i) => (
                        <Badge key={i} variant={crackedPassword === candidate ? "default" : "secondary"} className={cn("font-mono", attackResult === 'success' && crackedPassword === candidate && "bg-accent text-accent-foreground")}>
                            {attackResult === 'success' && crackedPassword === candidate && <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />}
                            {candidate}
                        </Badge>
                    ))}
                </div>
                
                {equivalentCommand && (
                <div className="space-y-2 pt-4">
                    <h4 className="font-semibold flex items-center"><Terminal className="mr-2"/>Remote Execution Command</h4>
                    <pre className="bg-black/80 rounded-md p-3 text-sm font-mono text-green-400 overflow-x-auto text-wrap">
                        <code>{equivalentCommand}</code>
                    </pre>
                </div>
                )}
                
                {!isDaemon ? renderCrackStatus() : (
                    isCracking ? (
                         <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Daemon cracking in progress via local terminal...</p>
                            <Progress value={crackProgress} />
                        </div>
                    ) : (
                        attackResult === 'success' ? renderCrackStatus() : attackResult === 'fail' ? renderCrackStatus() : <p>Waiting for result...</p>
                    )
                )}
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
