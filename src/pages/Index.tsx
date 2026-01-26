import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { VoiceOrb, OrbState } from '@/components/VoiceOrb';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useToast } from '@/hooks/use-toast';
import { ElevenLabsClient } from "elevenlabs"; //

// Configuración del cliente de ElevenLabs
// Nota: En producción, usa variables de entorno (import.meta.env.VITE_ELEVENLABS_API_KEY)
const elevenlabs = new ElevenLabsClient({
  apiKey: "TU_API_KEY_AQUI", 
});

const RODA_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // ID de voz de ejemplo (Rachel), cámbialo por el de R.O.D.A

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
      // 1. Añadir mensaje del usuario
      const userMessage: Message = {
        id: crypto.randomUUID(),
        type: 'user',
        text: transcript,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setCurrentTranscript('');
      
      // 2. Estado de procesamiento (Orbe girando)
      setOrbState('processing');

      try {
        // 3. Llamada a ElevenLabs para generar el audio
        const audioStream = await elevenlabs.generate({
          voice: RODA_VOICE_ID,
          text: `Entendido. Estoy procesando tu mensaje: ${transcript}`,
          model_id: "eleven_multilingual_v2"
        });

        // 4. Convertir el stream a un objeto que el navegador pueda reproducir
        const chunks: Uint8Array[] = [];
        for await (const chunk of audioStream as any) {
          chunks.push(chunk);
        }
        const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // 5. Reproducir audio y actualizar UI
        audio.onplay = () => {
          // Opcional: podrías cambiar el estado aquí si quieres una animación específica mientras habla
        };

        audio.onended = () => {
          setOrbState('idle'); // El orbe vuelve a morado al terminar
          URL.revokeObjectURL(audioUrl); // Limpieza de memoria
        };

        await audio.play();

        const rodaResponse: Message = {
          id: crypto.randomUUID(),
          type: 'roda',
          text: `Respuesta de R.O.D.A generada por ElevenLabs para: "${transcript}"`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, rodaResponse]);
      } catch (error) {
        console.error("Error en la llamada a ElevenLabs:", error);
        toast({
          variant: 'destructive',
          title: 'Error de ElevenLabs',
          description: 'No se pudo generar la voz de R.O.D.A',
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
      setOrbState('listening'); // Cambia a verde
    }
  }, [isListening, isSupported, startListening, stopListening, toast]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-roda-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-12">
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <VoiceOrb
            state={orbState}
            audioLevel={audioLevel}
            onClick={handleOrbClick}
          />

          <div className="mt-16 w-64">
            <AudioVisualizer
              isActive={isListening}
              audioLevel={audioLevel}
            />
          </div>
        </div>

        <div className="w-full mt-8">
          <TranscriptionDisplay
            messages={messages}
            currentTranscript={currentTranscript || undefined}
            isProcessing={orbState === 'processing'}
          />
        </div>
      </main>

      <footer className="py-4 text-center">
        <p className="text-xs font-mono text-muted-foreground/40">
          Presiona el orbe para iniciar • Powered by ElevenLabs
        </p>
      </footer>
    </div>
  );
};

export default Index;
