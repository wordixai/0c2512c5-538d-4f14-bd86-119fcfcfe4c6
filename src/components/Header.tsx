import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold gradient-text">AI 换装</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#upload" className="text-muted-foreground hover:text-foreground transition-colors">
            上传照片
          </a>
          <a href="#wardrobe" className="text-muted-foreground hover:text-foreground transition-colors">
            服装库
          </a>
          <a href="#preview" className="text-muted-foreground hover:text-foreground transition-colors">
            效果预览
          </a>
        </nav>
      </div>
    </header>
  );
}
