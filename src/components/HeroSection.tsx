import { ArrowDown, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
      <div className="animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
          <Wand2 className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI 驱动的智能换装</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text">一键换装</span>
          <br />
          <span className="text-foreground">打造你的时尚风格</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          上传你的照片，从海量服装中选择心仪款式，
          <br className="hidden md:block" />
          AI 将为你呈现完美的换装效果
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="glow-border bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
            onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
          >
            开始体验
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border hover:bg-secondary px-8 py-6 text-lg"
            onClick={() => document.getElementById('wardrobe')?.scrollIntoView({ behavior: 'smooth' })}
          >
            浏览服装
          </Button>
        </div>
      </div>

      <div className="absolute bottom-10 animate-float">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
}
