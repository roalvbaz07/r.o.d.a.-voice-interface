import { useConversation } from '@elevenlabs/react';
import { useCallback, useState } from 'react';

export type ConversationStatus = 'disconnected' | 'connecting' | 'connected';

interface UseElevenLabsConversationOptions {
  agentId: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
  onMessage?: (message: { type: string; text?: string }) => void;
}

export const useElevenLabsConversation = ({
  agentId,
  onConnect,
  onDisconnect,
  onError,
  onMessage,
}: UseElevenLabsConversationOptions) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      setIsConnecting(false);
      onConnect?.();
    },
    onDisconnect: () => {
      setIsConnecting(false);
      onDisconnect?.();
    },
    onMessage: (message) => {
      const msg = message as unknown as Record<string, unknown>;
      const msgType = msg.type as string | undefined;
      const msgText = msg.text as string | undefined;
      onMessage?.({
        type: msgType || 'unknown',
        text: msgText,
      });
    },
    onError: (error) => {
      setIsConnecting(false);
      console.error('ElevenLabs error:', error);
      onError?.(error.message || 'Error de conexión');
    },
  });

  const startConversation = useCallback(async () => {
    if (conversation.status === 'connected' || isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with the public agent (no token needed)
      await conversation.startSession({
        agentId,
        connectionType: 'webrtc',
      } as Parameters<typeof conversation.startSession>[0]);
    } catch (error) {
      setIsConnecting(false);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Failed to start conversation:', error);
      onError?.(errorMessage);
    }
  }, [conversation, agentId, isConnecting, onError]);

  const stopConversation = useCallback(async () => {
    if (conversation.status === 'disconnected') return;
    await conversation.endSession();
  }, [conversation]);

  const toggleConversation = useCallback(async () => {
    if (conversation.status === 'connected') {
      await stopConversation();
    } else {
      await startConversation();
    }
  }, [conversation.status, startConversation, stopConversation]);

  const status: ConversationStatus = isConnecting 
    ? 'connecting' 
    : conversation.status === 'connected' 
      ? 'connected' 
      : 'disconnected';

  return {
    status,
    isSpeaking: conversation.isSpeaking,
    startConversation,
    stopConversation,
    toggleConversation,
  };
};
