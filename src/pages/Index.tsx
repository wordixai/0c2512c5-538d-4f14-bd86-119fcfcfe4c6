import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { UploadSection } from '@/components/UploadSection';
import { WardrobeSection } from '@/components/WardrobeSection';
import { PreviewSection } from '@/components/PreviewSection';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  image: string;
}

export default function Index() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<{ id: string; image: string } | null>(null);
  const [customClothingItems, setCustomClothingItems] = useState<ClothingItem[]>([]);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl || null);
  };

  const handleSelectClothing = (clothing: { id: string; image: string } | null) => {
    setSelectedClothing(clothing);
  };

  const handleAddCustomClothing = (item: ClothingItem) => {
    setCustomClothingItems(prev => [...prev, item]);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <UploadSection
          onImageUpload={handleImageUpload}
          uploadedImage={uploadedImage}
        />
        <WardrobeSection
          selectedClothing={selectedClothing}
          onSelectClothing={handleSelectClothing}
          customClothingItems={customClothingItems}
          onAddCustomClothing={handleAddCustomClothing}
        />
        <PreviewSection
          uploadedImage={uploadedImage}
          selectedClothing={selectedClothing}
        />
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
