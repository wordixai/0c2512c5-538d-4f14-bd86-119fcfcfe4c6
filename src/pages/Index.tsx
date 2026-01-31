import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { UploadSection } from '@/components/UploadSection';
import { WardrobeSection } from '@/components/WardrobeSection';
import { PreviewSection } from '@/components/PreviewSection';
import { Footer } from '@/components/Footer';

export default function Index() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl || null);
  };

  const handleSelectClothing = (id: string) => {
    setSelectedClothing(id === selectedClothing ? null : id);
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
        />
        <PreviewSection
          uploadedImage={uploadedImage}
          selectedClothing={selectedClothing}
        />
      </main>
      <Footer />
    </div>
  );
}
