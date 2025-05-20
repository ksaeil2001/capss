import React from "react";

/**
 * Grid layout of images for inspiration section
 */
const ImageGrid: React.FC = () => {
  // Image sources from Unsplash with high-quality healthy food and fitness lifestyle images
  const images = [
    {
      src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&h=500&q=80",
      alt: "건강한 과일과 야채 식단",
    },
    {
      src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&h=500&q=80",
      alt: "신선한 식재료로 구성된 식단",
    },
    {
      src: "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?auto=format&fit=crop&w=500&h=500&q=80",
      alt: "건강한 라이프스타일을 즐기는 여성",
    },
    {
      src: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=500&h=500&q=80",
      alt: "운동과 건강 관리",
    },
    {
      src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&h=500&q=80",
      alt: "다양한 색상의 건강한 식단",
    },
    {
      src: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=500&h=500&q=80",
      alt: "신선한 야채와 과일",
    },
    {
      src: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?auto=format&fit=crop&w=500&h=500&q=80",
      alt: "웨이트 트레이닝을 하는 사람",
    },
    {
      src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=500&h=500&q=80",
      alt: "달리기와 활동적인 생활",
    },
  ];

  // Display only 4 images in the grid
  const displayImages = images.slice(0, 4);

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto max-w-[640px] px-4">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          맞춤형 건강식단을 통한 건강한 라이프스타일
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayImages.map((image, index) => (
            <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGrid;
