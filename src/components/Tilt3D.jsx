import React, { useRef } from 'react';

/**
 * Mouse-follow 3D tilt with a soft light glare. Pointer devices only:
 * touch and reduced-motion users get the plain content, no transforms.
 */
const Tilt3D = ({ children, className = '', max = 9, scale = 1.025, glare = true }) => {
  const ref = useRef(null);
  const glareRef = useRef(null);
  const raf = useRef(0);

  const enabled = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const onMove = (e) => {
    if (!enabled()) return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;
      el.style.transition = 'transform 90ms linear';
      el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * max * 2}deg) rotateX(${(0.5 - y) * max * 2}deg) scale3d(${scale},${scale},${scale})`;
      if (glareRef.current) {
        glareRef.current.style.opacity = '1';
        glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.45), transparent 55%)`;
      }
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
          style={{ opacity: 0, mixBlendMode: 'soft-light' }}
        />
      )}
    </div>
  );
};

export default Tilt3D;
