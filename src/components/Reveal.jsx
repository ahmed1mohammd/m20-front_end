import React, { useEffect, useRef, useState } from 'react';

const DIRECTION_TRANSFORMS = {
  up: (d) => `translate3d(0, ${d}px, 0)`,
  down: (d) => `translate3d(0, -${d}px, 0)`,
  left: (d) => `translate3d(${d}px, 0, 0)`,
  right: (d) => `translate3d(-${d}px, 0, 0)`,
  none: () => 'translate3d(0, 0, 0)',
};

/**
 * Lightweight IntersectionObserver scroll-reveal wrapper for M20 luxury pacing.
 */
const Reveal = ({
  children,
  className = '',
  delay = 0,
  duration = 700,
  direction = 'up',
  distance = 22,
  threshold = 0.12,
  once = true,
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true;
    if (typeof IntersectionObserver === 'undefined') return true;
    return false;
  });

  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(node);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -32px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, once, threshold]);

  // 3D entrance: sections tip up from the floor (rotateX) while rising into place.
  const rotateX = direction === 'up' ? 12 : 0;
  const hiddenTransform = `perspective(1000px) rotateX(${rotateX}deg) ${(
    DIRECTION_TRANSFORMS[direction] || DIRECTION_TRANSFORMS.up
  )(distance)}`;
  const shownTransform = 'perspective(1000px) rotateX(0deg) translate3d(0, 0, 0)';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? shownTransform : hiddenTransform,
        transformOrigin: '50% 100%',
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;
