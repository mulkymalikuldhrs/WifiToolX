
"use client";

import { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '@/app/actions';
import { Bot, Send, Loader2, WifiOff, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
}

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function Chatbot({ isOpen, onClose, isOnline }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'model', content: 'Hello! I am your Cyber Pentest AI Assistant. How can I help you today?' },
      ]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || !isOnline) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await getChatbotResponse({
      history: messages,
      message: input,
    });

    setIsLoading(false);

    if ('error' in result) {
      const errorMessage: Message = { role: 'model', content: `Error: ${result.error}` };
      setMessages(prev => [...prev, errorMessage]);
    } else {
      const modelMessage: Message = { role: 'model', content: result.response };
      setMessages(prev => [...prev, modelMessage]);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-6 w-full max-w-md h-[60vh] bg-background/80 backdrop-blur-lg border border-primary/20 rounded-lg shadow-2xl flex flex-col z-50">
      <header className="flex items-center justify-between p-4 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Bot className="text-primary" />
          <h3 className="font-headline text-lg">Cyber Pentest Assistant</h3>
        </div>
         <Badge variant={isOnline ? 'success' : 'destructive'} className="gap-1.5 text-xs">
            {isOnline ? 'Online' : <><WifiOff className="w-3 h-3"/> Offline</>}
          </Badge>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </header>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
               {msg.role === 'model' && <Bot className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
               <div className={cn("p-3 rounded-lg max-w-xs md:max-w-sm break-words", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                 <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
           {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <footer className="p-4 border-t border-primary/20">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isOnline ? "Ask about pentesting..." : "You are offline."}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={!isOnline || isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!isOnline || isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </footer>
    </div>
  );
}
