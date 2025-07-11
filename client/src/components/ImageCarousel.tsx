import React, { useState } from "react";

interface ImageCarouselProps {
  images: string[];
  altBase?: string;
  className?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altBase = "Vehicle image", className = "" }) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ aspectRatio: '4/3', minHeight: 120 }}>
        <span className="text-gray-400">No images</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className={`relative ${className}`}>  
      <img
        src={images[current]}
        alt={`${altBase} ${current + 1}`}
        className="w-full h-48 object-cover rounded-lg transition-all duration-300"
        style={{ aspectRatio: '4/3' }}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow p-1"
            aria-label="Previous image"
            type="button"
          >
            &#8592;
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow p-1"
            aria-label="Next image"
            type="button"
          >
            &#8594;
          </button>
        </>
      )}
      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full ${current === idx ? 'bg-blue-500' : 'bg-gray-300'} border border-white`}
              aria-label={`Go to image ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
};
