import { cn } from '@/lib/utils';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-roda-purple to-primary flex items-center justify-center">
                <span className="text-xs font-bold text-background">R</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-roda-green animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-wider text-foreground">
                R.O.D.A
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                Voice Interface v1.0
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-roda-green animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">
              Sistema activo
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
