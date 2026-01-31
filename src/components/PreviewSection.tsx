import { useState } from 'react';
import { Wand2, Download, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PreviewSectionProps {
  uploadedImage: string | null;
  selectedClothing: {
    id: string;
    image: string;
  } | null;
}

export function PreviewSection({ uploadedImage, selectedClothing }: PreviewSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedClothing) return;

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('virtual-try-on', {
        body: {
          personImage: uploadedImage,
          clothingImage: selectedClothing.image,
        }
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.image) {
        setGeneratedImage(data.image);
        toast.success('换装成功！');
      } else {
        throw new Error('未收到生成的图片');
      }
    } catch (err) {
      console.error('Virtual try-on error:', err);
      const message = err instanceof Error ? err.message : '换装失败，请重试';
      setError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-tryon-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('图片已下载');
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
            点击生成按钮，AI 将为你呈现真实换装效果
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
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-medium">AI 正在为你换装...</p>
                    <p className="text-sm text-muted-foreground mt-1">这可能需要 10-30 秒</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
              ) : error ? (
                <div className="text-center px-4">
                  <p className="text-destructive mb-2">{error}</p>
                  <p className="text-sm text-muted-foreground">请重试或更换照片</p>
                </div>
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
                onClick={handleDownload}
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
