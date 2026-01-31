import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold gradient-text">AI 换装</span>
          </div>

          <p className="text-muted-foreground text-sm text-center">
            使用先进的 AI 技术，为你打造完美的换装体验
          </p>

          <p className="text-muted-foreground text-sm">
            © 2025 AI 换装. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
