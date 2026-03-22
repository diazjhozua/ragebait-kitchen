import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  triggerOnce = true
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const currentTarget = targetRef.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;

        setIsIntersecting(isCurrentlyIntersecting);

        if (isCurrentlyIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }

        // If triggerOnce is true and we've intersected, disconnect
        if (triggerOnce && isCurrentlyIntersecting) {
          observer.disconnect();
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    );

    observer.observe(currentTarget);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce, hasIntersected]);

  return {
    targetRef,
    isIntersecting,
    hasIntersected
  };
}

// Hook for lazy loading images
export function useLazyImage(src: string, options: UseIntersectionObserverProps = {}) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver(options);

  useEffect(() => {
    if (hasIntersected && !imageSrc) {
      setImageSrc(src);
    }
  }, [hasIntersected, src, imageSrc]);

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();

    img.onload = () => {
      setIsLoaded(true);
      setIsError(false);
    };

    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
    };

    img.src = imageSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc]);

  return {
    targetRef,
    imageSrc,
    isLoaded,
    isError,
    hasIntersected
  };
}

// Hook for animations on scroll
export function useScrollAnimation(animationClass: string = 'fade-in') {
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true
  });

  const className = hasIntersected ? animationClass : 'opacity-0';

  return {
    targetRef,
    className,
    hasAnimated: hasIntersected
  };
}

// Hook for counting up numbers when in view
export function useCountUp(
  end: number,
  duration: number = 2000,
  start: number = 0,
  options: UseIntersectionObserverProps = {}
) {
  const [count, setCount] = useState(start);
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: true,
    ...options
  });

  useEffect(() => {
    if (!hasIntersected) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeOut);

      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [hasIntersected, end, duration, start]);

  return {
    targetRef,
    count,
    hasStarted: hasIntersected
  };
}

// Hook for viewport detection
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewport;
}

// Hook for scroll position
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY;

      setScrollY(currentScrollY);
      setScrollDirection(currentScrollY > previousScrollY ? 'down' : 'up');

      previousScrollY = currentScrollY;
    };

    const throttledUpdateScrollPosition = throttle(updateScrollPosition, 16); // ~60fps

    window.addEventListener('scroll', throttledUpdateScrollPosition);

    return () => window.removeEventListener('scroll', throttledUpdateScrollPosition);
  }, []);

  return { scrollY, scrollDirection };
}

// Throttle utility
function throttle<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}