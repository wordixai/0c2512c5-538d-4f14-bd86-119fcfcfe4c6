import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadSectionProps {
  onImageUpload: (imageUrl: string) => void;
  uploadedImage: string | null;
}

export function UploadSection({ onImageUpload, uploadedImage }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onImageUpload(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImageUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onImageUpload('');
  };

  return (
    <section id="upload" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">上传你的照片</span>
          </h2>
          <p className="text-muted-foreground">
            支持 JPG、PNG 格式，建议使用正面全身照获得最佳效果
          </p>
        </div>

        {!uploadedImage ? (
          <div
            className={`upload-zone rounded-2xl p-12 text-center cursor-pointer transition-all ${
              isDragging ? 'border-primary bg-primary/5' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground mb-2">
                  拖放图片到这里，或点击上传
                </p>
                <p className="text-sm text-muted-foreground">
                  最大文件大小: 10MB
                </p>
              </div>
              <Button variant="outline" className="mt-4">
                <ImageIcon className="w-4 h-4 mr-2" />
                选择图片
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden card-gradient p-2">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full max-h-[500px] object-contain rounded-xl"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-4 right-4"
              onClick={clearImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
