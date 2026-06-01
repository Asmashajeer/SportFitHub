import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // I recommend lucide-react for icons

interface props {
  images: string[];
}

const ImageCarousel = ({ images }: props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full max-w-3xl mx-auto group">
      {/* Viewport */}
      <div className="overflow-hidden rounded-2xl shadow-xl" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((image, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-80 md:h-125 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Side Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/3 -translate-y-1/2 z-10 text-emerald-400 border-2 hover:border-primary p-1 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-emerald-600" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/3 -translate-y-1/2 z-10 text-emerald-400 border-2 hover:border-primary p-1 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-emerald-600" />
      </button>

      {/* Dot Indicators - Positioned over the image bottom */}
      <div className="absolute bottom-5/12 left-1/2  translate-x-1/2 flex gap-2 z-50 ">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 transition-all duration-100 rounded-full z-50 border-black ${
              index === selectedIndex
                ? 'w-4 bg-emerald-500'
                : 'w-2 bg-white/80 hover:bg-white border border-black'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
