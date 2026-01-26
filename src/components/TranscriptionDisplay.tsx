import { cn } from '@/lib/utils';
import { TypewriterText } from './TypewriterText';

interface Message {
  id: string;
  type: 'user' | 'roda';
  text: string;
  timestamp: Date;
}

interface TranscriptionDisplayProps {
  messages: Message[];
  currentTranscript?: string;
  isProcessing?: boolean;
}

export const TranscriptionDisplay = ({
  messages,
  currentTranscript,
  isProcessing,
}: TranscriptionDisplayProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* R.O.D.A Response Area */}
      <div className="glass rounded-2xl p-6 min-h-[120px] relative overflow-hidden scanlines">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-primary uppercase tracking-widest">
            R.O.D.A
          </span>
        </div>

        {messages.length > 0 && messages[messages.length - 1].type === 'roda' ? (
          <div className="text-foreground text-lg leading-relaxed">
            <TypewriterText
              text={messages[messages.length - 1].text}
              speed={25}
            />
          </div>
        ) : isProcessing ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm font-mono">Analizando...</span>
          </div>
        ) : (
          <p className="text-muted-foreground/50 text-sm font-mono italic">
            Esperando entrada de voz...
          </p>
        )}
      </div>

      {/* User Transcript Area */}
      <div className="text-center">
        {currentTranscript ? (
          <p className="text-muted-foreground/60 text-base font-light italic">
            "{currentTranscript}"
          </p>
        ) : messages.length > 0 && messages[messages.length - 1].type === 'user' ? (
          <p className="text-muted-foreground/50 text-base font-light italic">
            "{messages[messages.length - 1].text}"
          </p>
        ) : null}
      </div>

      {/* Conversation History */}
      {messages.length > 2 && (
        <div className="border-t border-border/30 pt-4 mt-6">
          <details className="group">
            <summary className="text-xs font-mono text-muted-foreground/50 cursor-pointer hover:text-muted-foreground transition-colors">
              Historial de conversación ({Math.floor(messages.length / 2)} intercambios)
            </summary>
            <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
              {messages.slice(0, -2).map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'text-sm py-2 px-3 rounded-lg',
                    msg.type === 'user'
                      ? 'text-muted-foreground/50 text-right'
                      : 'text-foreground/70 bg-card/50'
                  )}
                >
                  <span className="text-[10px] font-mono text-muted-foreground/30 block mb-1">
                    {msg.type === 'roda' ? 'R.O.D.A' : 'Usuario'}
                  </span>
                  {msg.text}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
