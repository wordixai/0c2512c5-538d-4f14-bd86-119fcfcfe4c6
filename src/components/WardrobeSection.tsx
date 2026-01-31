import { Check } from 'lucide-react';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  image: string;
}

const clothingItems: ClothingItem[] = [
  {
    id: '1',
    name: '经典白衬衫',
    category: '上装',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
  },
  {
    id: '2',
    name: '黑色西装外套',
    category: '外套',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
  },
  {
    id: '3',
    name: '牛仔夹克',
    category: '外套',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop',
  },
  {
    id: '4',
    name: '针织毛衣',
    category: '上装',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
  },
  {
    id: '5',
    name: '连衣裙',
    category: '裙装',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
  },
  {
    id: '6',
    name: '运动卫衣',
    category: '上装',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
  },
];

interface WardrobeSectionProps {
  selectedClothing: string | null;
  onSelectClothing: (id: string) => void;
}

export function WardrobeSection({ selectedClothing, onSelectClothing }: WardrobeSectionProps) {
  return (
    <section id="wardrobe" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">选择服装</span>
          </h2>
          <p className="text-muted-foreground">
            从我们的时尚服装库中选择你喜欢的款式
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {clothingItems.map((item) => (
            <div
              key={item.id}
              className={`clothing-card rounded-xl overflow-hidden cursor-pointer ${
                selectedClothing === item.id ? 'selected' : ''
              }`}
              onClick={() => onSelectClothing(item.id)}
            >
              <div className="relative aspect-[4/5]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {selectedClothing === item.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-background/80 text-foreground">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-foreground truncate">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
