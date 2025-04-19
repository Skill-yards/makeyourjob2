
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

/**
 * CustomCarousel - A reusable, responsive carousel component
 * 
 * @param {Object} props
 * @param {React.ReactNode[]} props.items - Array of React elements to display as slides
 * @param {number} props.interval - Auto-scroll interval in milliseconds (default: 5000ms)
 * @param {boolean} props.autoPlay - Whether to auto-scroll (default: true)
 * @param {boolean} props.showIndicators - Whether to show dot indicators (default: true)
 * @param {boolean} props.showArrows - Whether to show navigation arrows (default: true)
 * @param {string} props.className - Additional classes for the container
 * @param {string} props.slideClassName - Additional classes for each slide
 * @param {string} props.indicatorClassName - Additional classes for indicators
 * @param {string} props.arrowClassName - Additional classes for arrows
 */
const CustomCarousel = ({
  items = [],
  interval = 5000,
  autoPlay = true,
  showIndicators = true,
  showArrows = true,
  className = "",
  slideClassName = "",
  indicatorClassName = "",
  arrowClassName = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const timeoutRef = useRef(null);
  const touchStartX = useRef(0);

  // Navigate to a specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetTimeout();
  };

  // Go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
    resetTimeout();
  };

  // Go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
    resetTimeout();
  };

  // Reset the auto-scroll timeout
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Handle touch end for swipe gestures
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // If the swipe is significant enough
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Toggle auto-play
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Setup auto-scroll effect
  useEffect(() => {
    resetTimeout();
    
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, interval);
    }
    
    return () => {
      resetTimeout();
    };
  }, [currentIndex, isPlaying, interval]);

  // If no items provided, don't render anything
  if (!items.length) return null;

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl",
        className
      )}
    >
      {/* Carousel container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div 
            key={index} 
            className={cn(
              "flex-shrink-0 w-full h-full",
              slideClassName
            )}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-md backdrop-blur-sm p-2 border border-gray-100 dark:border-gray-700",
              "opacity-70 hover:opacity-100 transition-opacity",
              arrowClassName
            )}
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-md backdrop-blur-sm p-2 border border-gray-100 dark:border-gray-700",
              "opacity-70 hover:opacity-100 transition-opacity",
              arrowClassName
            )}
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>
        </>
      )}

      {/* Slide indicators */}
      {/* {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 ease-in-out",
                currentIndex === index 
                  ? "bg-purple-700 dark:bg-purple-500 w-6" 
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500",
                indicatorClassName
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default CustomCarousel;