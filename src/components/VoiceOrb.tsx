import { cn } from '@/lib/utils';

export type OrbState = 'idle' | 'listening' | 'processing';

interface VoiceOrbProps {
  state: OrbState;
  audioLevel?: number;
  onClick?: () => void;
}

export const VoiceOrb = ({ state, audioLevel = 0, onClick }: VoiceOrbProps) => {

  const stateStyles = {
    idle: {
      gradient: 'from-roda-purple via-secondary to-roda-purple',
      glow: 'shadow-[0_0_60px_hsl(263_70%_60%/0.4)]',
      animation: 'animate-pulse-slow',
      ringColor: 'border-roda-purple/30',
    },
    listening: {
      gradient: 'from-roda-green via-accent to-roda-green',
      glow: 'shadow-[0_0_80px_hsl(142_70%_50%/0.5)]',
      animation: 'animate-pulse-fast',
      ringColor: 'border-roda-green/40',
    },
    processing: {
      gradient: 'from-roda-purple via-primary to-roda-purple',
      glow: 'shadow-[0_0_70px_hsl(263_70%_60%/0.5)]',
      animation: 'animate-spin-slow',
      ringColor: 'border-roda-purple/30',
    },
  };

  const currentStyle = stateStyles[state];

  // Dynamic scale based on audio level when listening
  const dynamicScale = state === 'listening' ? 1 + audioLevel * 0.15 : 1;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer expanding rings */}
      {state === 'listening' && (
        <>
          <div
            className={cn(
              'absolute w-64 h-64 rounded-full border-2 opacity-30',
              currentStyle.ringColor,
              'animate-ring-expand'
            )}
            style={{ animationDelay: '0s' }}
          />
          <div
            className={cn(
              'absolute w-64 h-64 rounded-full border-2 opacity-30',
              currentStyle.ringColor,
              'animate-ring-expand'
            )}
            style={{ animationDelay: '0.5s' }}
          />
          <div
            className={cn(
              'absolute w-64 h-64 rounded-full border-2 opacity-30',
              currentStyle.ringColor,
              'animate-ring-expand'
            )}
            style={{ animationDelay: '1s' }}
          />
        </>
      )}

      {/* Outer glow ring */}
      <div
        className={cn(
          'absolute w-56 h-56 rounded-full',
          'bg-gradient-to-r',
          currentStyle.gradient,
          'opacity-20 blur-xl transition-all duration-500'
        )}
        style={{ transform: `scale(${dynamicScale * 1.2})` }}
      />

      {/* Middle ring */}
      <div
        className={cn(
          'absolute w-48 h-48 rounded-full border',
          currentStyle.ringColor,
          'transition-all duration-300'
        )}
        style={{ transform: `scale(${dynamicScale})` }}
      />

      {/* Main orb */}
      <button
        onClick={onClick}
        className={cn(
          'relative w-40 h-40 rounded-full cursor-pointer',
          'bg-gradient-conic',
          'transition-all duration-300 ease-out',
          currentStyle.glow,
          currentStyle.animation,
          'hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-4 focus:ring-offset-background'
        )}
        style={{
          background: `conic-gradient(from 0deg, ${
            state === 'idle'
              ? 'hsl(263 70% 60%), hsl(263 70% 40%), hsl(263 70% 60%)'
              : state === 'listening'
              ? 'hsl(142 70% 50%), hsl(142 70% 30%), hsl(142 70% 50%)'
              : 'hsl(263 70% 60%), hsl(190 100% 50%), hsl(263 70% 60%)'
          })`,
          transform: `scale(${dynamicScale})`,
        }}
      >
        {/* Inner core */}
        <div
          className={cn(
            'absolute inset-4 rounded-full',
            'bg-gradient-radial from-background/80 to-background/40',
            'backdrop-blur-sm'
          )}
        />

        {/* Center dot */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center'
          )}
        >
          <div
            className={cn(
              'w-4 h-4 rounded-full',
              state === 'idle' && 'bg-roda-purple',
              state === 'listening' && 'bg-roda-green',
              state === 'processing' && 'bg-primary',
              'transition-colors duration-300'
            )}
          />
        </div>
      </button>

      {/* State label */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
        <span
          className={cn(
            'text-xs font-mono uppercase tracking-widest',
            state === 'idle' && 'text-roda-purple',
            state === 'listening' && 'text-roda-green',
            state === 'processing' && 'text-primary',
            'transition-colors duration-300'
          )}
        >
          {state === 'idle' && 'Toca para hablar'}
          {state === 'listening' && 'Escuchando...'}
          {state === 'processing' && 'Procesando...'}
        </span>
      </div>
    </div>
  );
};
