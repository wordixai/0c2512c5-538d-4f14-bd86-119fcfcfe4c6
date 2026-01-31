import { useState } from 'react';
import { Wand2, Download, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewSectionProps {
  uploadedImage: string | null;
  selectedClothing: string | null;
}

export function PreviewSection({ uploadedImage, selectedClothing }: PreviewSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedClothing) return;

    setIsGenerating(true);
    // 模拟 AI 处理时间
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 这里使用示例图片模拟生成结果
    setGeneratedImage('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop');
    setIsGenerating(false);
  };

  const canGenerate = uploadedImage && selectedClothing;

  return (
    <section id="preview" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">AI 换装预览</span>
          </h2>
          <p className="text-muted-foreground">
            点击生成按钮，AI 将为你呈现换装效果
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 原始图片 */}
          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground">原始照片</h3>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary flex items-center justify-center">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-muted-foreground text-center px-4">
                  请先上传照片
                </p>
              )}
            </div>
          </div>

          {/* 生成结果 */}
          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground">换装效果</h3>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-muted-foreground">AI 正在为你换装...</p>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-muted-foreground text-center px-4">
                  {canGenerate ? '点击下方按钮生成效果' : '请先上传照片并选择服装'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className={`glow-border bg-primary text-primary-foreground hover:bg-primary/90 px-8 ${
              !canGenerate ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                生成换装效果
              </>
            )}
          </Button>

          {generatedImage && (
            <>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary px-8"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                重新生成
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary px-8"
              >
                <Download className="w-5 h-5 mr-2" />
                下载图片
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
