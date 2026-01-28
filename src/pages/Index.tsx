import { useCallback, useState } from 'react';
import { Header } from '@/components/Header';
import { VoiceOrb, OrbState } from '@/components/VoiceOrb';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { useElevenLabsConversation } from '@/hooks/useElevenLabsConversation';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'roda';
  text: string;
  timestamp: Date;
}

const AGENT_ID = 'agent_5901kfx6dv3jegqbnc3ah2e01sfg';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const handleConnect = useCallback(() => {
    toast({
      title: 'Conectado',
      description: 'R.O.D.A está escuchando...',
    });
  }, [toast]);

  const handleDisconnect = useCallback(() => {
    toast({
      title: 'Desconectado',
      description: 'Sesión de voz finalizada',
    });
  }, [toast]);

  const handleError = useCallback((error: string) => {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error === 'not-allowed' 
        ? 'Por favor, permite el acceso al micrófono'
        : error,
    });
  }, [toast]);

  const handleMessage = useCallback((message: { type: string; text?: string }) => {
    if (message.type === 'user_transcript' && message.text) {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        type: 'user',
        text: message.text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
    } else if (message.type === 'agent_response' && message.text) {
      const rodaMessage: Message = {
        id: crypto.randomUUID(),
        type: 'roda',
        text: message.text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, rodaMessage]);
    }
  }, []);

  const {
    status,
    isSpeaking,
    toggleConversation,
  } = useElevenLabsConversation({
    agentId: AGENT_ID,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onError: handleError,
    onMessage: handleMessage,
  });

  // Determine orb state based on conversation status
  const getOrbState = (): OrbState => {
    if (status === 'connecting') return 'connecting';
    if (status === 'connected') {
      return isSpeaking ? 'speaking' : 'listening';
    }
    return 'idle';
  };

  const handleOrbClick = useCallback(() => {
    toggleConversation();
  }, [toggleConversation]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-roda-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-roda-purple/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-roda-purple/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-12">
        <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
          <VoiceOrb
            state={getOrbState()}
            onClick={handleOrbClick}
          />
        </div>

        <div className="w-full mt-8">
          <TranscriptionDisplay
            messages={messages}
            isProcessing={status === 'connecting'}
          />
        </div>
      </main>

      <footer className="py-4 text-center">
        <p className="text-xs font-mono text-muted-foreground/40">
          {status === 'connected' 
            ? 'Haz clic en el orbe para finalizar'
            : 'Presiona el orbe para iniciar'
          }
        </p>
      </footer>
    </div>
  );
};

export default Index;
