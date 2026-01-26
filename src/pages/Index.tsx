import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { VoiceOrb, OrbState } from '@/components/VoiceOrb';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'roda';
  text: string;
  timestamp: Date;
}

const Index = () => {
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const { toast } = useToast();

  const handleVoiceResult = useCallback(async (transcript: string, isFinal: boolean) => {
    setCurrentTranscript(transcript);

    if (isFinal && transcript.trim()) {
      // Add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        type: 'user',
        text: transcript,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setCurrentTranscript('');
      
      // Switch to processing state
      setOrbState('processing');

      // Simulate webhook call and response
      // TODO: Replace with actual webhook integration
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulated R.O.D.A response
        const rodaResponse: Message = {
          id: crypto.randomUUID(),
          type: 'roda',
          text: `He recibido tu mensaje: "${transcript}". Estoy procesando tu solicitud. Para integrar con un webhook real, configura el endpoint en la función sendToWebhook.`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, rodaResponse]);
        setOrbState('idle');
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudo procesar la solicitud',
        });
        setOrbState('idle');
      }
    }
  }, [toast]);

  const handleVoiceError = useCallback((error: string) => {
    toast({
      variant: 'destructive',
      title: 'Error de voz',
      description: error === 'not-allowed' 
        ? 'Por favor, permite el acceso al micrófono'
        : `Error: ${error}`,
    });
    setOrbState('idle');
  }, [toast]);

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    audioLevel,
  } = useVoiceRecognition({
    language: 'es-ES',
    onResult: handleVoiceResult,
    onError: handleVoiceError,
  });

  const handleOrbClick = useCallback(() => {
    if (!isSupported) {
      toast({
        variant: 'destructive',
        title: 'No soportado',
        description: 'El reconocimiento de voz no está soportado en este navegador',
      });
      return;
    }

    if (isListening) {
      stopListening();
      setOrbState('idle');
    } else {
      startListening();
      setOrbState('listening');
    }
  }, [isListening, isSupported, startListening, stopListening, toast]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-roda-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Header />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-12">
        {/* Orb section */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <VoiceOrb
            state={orbState}
            audioLevel={audioLevel}
            onClick={handleOrbClick}
          />

          {/* Audio visualizer */}
          <div className="mt-16 w-64">
            <AudioVisualizer
              isActive={isListening}
              audioLevel={audioLevel}
            />
          </div>
        </div>

        {/* Transcription section */}
        <div className="w-full mt-8">
          <TranscriptionDisplay
            messages={messages}
            currentTranscript={currentTranscript || undefined}
            isProcessing={orbState === 'processing'}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs font-mono text-muted-foreground/40">
          Presiona el orbe para iniciar • Powered by ElevenLabs
        </p>
      </footer>
    </div>
  );
};

export default Index;
