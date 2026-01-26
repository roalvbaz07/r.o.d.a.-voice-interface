import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  isActive: boolean;
  audioLevel: number;
  barCount?: number;
}

export const AudioVisualizer = ({
  isActive,
  audioLevel,
  barCount = 32,
}: AudioVisualizerProps) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-[2px] h-12">
      {bars.map((_, index) => {
        // Create a wave pattern based on position and audio level
        const offset = Math.sin((index / barCount) * Math.PI * 2) * 0.5 + 0.5;
        const baseHeight = isActive ? 20 + audioLevel * 80 * offset : 4;
        const randomVariation = isActive ? Math.random() * audioLevel * 20 : 0;
        const height = Math.max(4, baseHeight + randomVariation);

        return (
          <div
            key={index}
            className={cn(
              'w-1 rounded-full transition-all duration-75',
              isActive ? 'bg-roda-green' : 'bg-muted-foreground/20'
            )}
            style={{
              height: `${height}%`,
              opacity: isActive ? 0.6 + audioLevel * 0.4 : 0.3,
              animationDelay: `${index * 30}ms`,
            }}
          />
        );
      })}
    </div>
  );
};
