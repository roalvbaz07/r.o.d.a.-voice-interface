import { cn } from '@/lib/utils';

export type OrbState = 'idle' | 'listening' | 'speaking' | 'connecting';

interface VoiceOrbProps {
  state: OrbState;
  onClick?: () => void;
}

export const VoiceOrb = ({ state, onClick }: VoiceOrbProps) => {
  const isActive = state === 'listening' || state === 'speaking';
  const isConnecting = state === 'connecting';

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow effect */}
      <div
        className={cn(
          'absolute w-80 h-80 rounded-full transition-all duration-700',
          'bg-gradient-radial from-roda-purple/20 via-roda-purple/5 to-transparent',
          isActive && 'from-roda-purple/30 via-roda-purple/10',
          isConnecting && 'animate-pulse'
        )}
      />

      {/* Outermost decorative ring with dashes */}
      <div
        className={cn(
          'absolute w-72 h-72 rounded-full',
          'border border-roda-purple/20',
          isActive && 'border-roda-purple/40'
        )}
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 10deg, hsl(var(--roda-purple) / 0.1) 10deg, hsl(var(--roda-purple) / 0.1) 12deg, transparent 12deg, transparent 30deg, hsl(var(--roda-purple) / 0.1) 30deg, hsl(var(--roda-purple) / 0.1) 32deg, transparent 32deg)`,
        }}
      />

      {/* Tech segments - outer */}
      <svg className="absolute w-72 h-72" viewBox="0 0 288 288">
        {/* Outer arc segments */}
        <g className={cn('transition-opacity duration-500', isActive ? 'opacity-80' : 'opacity-40')}>
          <path
            d="M 144 20 A 124 124 0 0 1 230 50"
            fill="none"
            stroke="hsl(var(--roda-purple))"
            strokeWidth="2"
            strokeLinecap="round"
            className={cn(isActive && 'animate-pulse')}
          />
          <path
            d="M 250 80 A 124 124 0 0 1 268 144"
            fill="none"
            stroke="hsl(var(--roda-purple))"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 268 144 A 124 124 0 0 1 230 238"
            fill="none"
            stroke="hsl(var(--roda-purple))"
            strokeWidth="2"
            strokeLinecap="round"
            className={cn(isActive && 'animate-pulse')}
          />
          <path
            d="M 58 50 A 124 124 0 0 1 144 20"
            fill="none"
            stroke="hsl(var(--roda-purple))"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <path
            d="M 20 144 A 124 124 0 0 1 58 50"
            fill="none"
            stroke="hsl(var(--roda-purple))"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 58 238 A 124 124 0 0 1 20 144"
            fill="none"
            stroke="hsl(var(--roda-purple))"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </g>

        {/* Decorative dots */}
        <g className={cn('transition-opacity duration-500', isActive ? 'opacity-100' : 'opacity-50')}>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <circle
              key={angle}
              cx={144 + 130 * Math.cos((angle * Math.PI) / 180)}
              cy={144 + 130 * Math.sin((angle * Math.PI) / 180)}
              r={i % 3 === 0 ? 3 : 2}
              fill="hsl(var(--roda-purple))"
              className={cn(isActive && i % 2 === 0 && 'animate-pulse')}
            />
          ))}
        </g>
      </svg>

      {/* Middle tech ring */}
      <div
        className={cn(
          'absolute w-56 h-56 rounded-full',
          'border-2 border-roda-purple/30',
          'transition-all duration-500',
          isActive && 'border-roda-purple/60',
          state === 'speaking' && 'animate-spin-slow'
        )}
      />

      {/* Inner decorative ring with notches */}
      <svg className="absolute w-56 h-56" viewBox="0 0 224 224">
        <g className={cn('transition-opacity duration-500', isActive ? 'opacity-80' : 'opacity-40')}>
          {/* Tick marks around the ring */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6 * Math.PI) / 180;
            const innerRadius = i % 5 === 0 ? 95 : 100;
            const outerRadius = 105;
            return (
              <line
                key={i}
                x1={112 + innerRadius * Math.cos(angle)}
                y1={112 + innerRadius * Math.sin(angle)}
                x2={112 + outerRadius * Math.cos(angle)}
                y2={112 + outerRadius * Math.sin(angle)}
                stroke="hsl(var(--roda-purple))"
                strokeWidth={i % 5 === 0 ? 2 : 1}
                opacity={i % 5 === 0 ? 1 : 0.5}
              />
            );
          })}
        </g>
      </svg>

      {/* Accent arcs */}
      <svg 
        className={cn(
          'absolute w-52 h-52 transition-transform duration-1000',
          isActive && 'animate-spin-reverse-slow'
        )} 
        viewBox="0 0 208 208"
      >
        <path
          d="M 104 15 A 89 89 0 0 1 180 60"
          fill="none"
          stroke="hsl(var(--roda-purple))"
          strokeWidth="3"
          strokeLinecap="round"
          className={cn('transition-opacity', isActive ? 'opacity-100' : 'opacity-60')}
        />
        <path
          d="M 104 193 A 89 89 0 0 1 28 148"
          fill="none"
          stroke="hsl(var(--roda-purple))"
          strokeWidth="3"
          strokeLinecap="round"
          className={cn('transition-opacity', isActive ? 'opacity-100' : 'opacity-60')}
        />
      </svg>

      {/* Inner core ring */}
      <div
        className={cn(
          'absolute w-44 h-44 rounded-full',
          'border border-roda-purple/40',
          'transition-all duration-500',
          isActive && 'border-roda-purple/70 shadow-[0_0_30px_hsl(var(--roda-purple)/0.3)]'
        )}
      />

      {/* Main orb button */}
      <button
        onClick={onClick}
        className={cn(
          'relative w-36 h-36 rounded-full cursor-pointer',
          'bg-gradient-radial from-background via-background/95 to-background/80',
          'border-2 border-roda-purple/50',
          'transition-all duration-300 ease-out',
          'shadow-[inset_0_0_40px_hsl(var(--roda-purple)/0.1)]',
          'hover:scale-105 hover:border-roda-purple/70',
          'active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-roda-purple/50 focus:ring-offset-4 focus:ring-offset-background',
          isActive && 'border-roda-purple shadow-[inset_0_0_60px_hsl(var(--roda-purple)/0.2),0_0_40px_hsl(var(--roda-purple)/0.3)]',
          isConnecting && 'animate-pulse'
        )}
      >
        {/* Inner glow */}
        <div
          className={cn(
            'absolute inset-2 rounded-full',
            'bg-gradient-radial from-roda-purple/10 via-transparent to-transparent',
            'transition-opacity duration-500',
            isActive && 'from-roda-purple/20'
          )}
        />

        {/* R.O.D.A text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              'text-lg font-mono font-semibold tracking-[0.3em]',
              'text-roda-purple transition-all duration-500',
              isActive && 'text-glow-purple'
            )}
          >
            R.O.D.A
          </span>
        </div>
      </button>

      {/* State label */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
        <span
          className={cn(
            'text-xs font-mono uppercase tracking-widest',
            'text-roda-purple/70 transition-all duration-300',
            isActive && 'text-roda-purple text-glow-purple'
          )}
        >
          {state === 'idle' && 'Toca para hablar'}
          {state === 'connecting' && 'Conectando...'}
          {state === 'listening' && 'Escuchando...'}
          {state === 'speaking' && 'R.O.D.A habla...'}
        </span>
      </div>

      {/* Pulse rings when active */}
      {isActive && (
        <>
          <div
            className="absolute w-36 h-36 rounded-full border border-roda-purple/30 animate-ring-expand"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="absolute w-36 h-36 rounded-full border border-roda-purple/30 animate-ring-expand"
            style={{ animationDelay: '0.7s' }}
          />
          <div
            className="absolute w-36 h-36 rounded-full border border-roda-purple/30 animate-ring-expand"
            style={{ animationDelay: '1.4s' }}
          />
        </>
      )}
    </div>
  );
};
