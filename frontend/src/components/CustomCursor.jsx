import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, input, select, textarea, [data-cursor="pointer"]')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    let animId;
    const smoothFollow = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animId = requestAnimationFrame(smoothFollow);
    };
    animId = requestAnimationFrame(smoothFollow);
    return () => cancelAnimationFrame(animId);
  }, [pos]);

  if (!isVisible) return null;

  return (
    <>
      {/* Center Gold Dot */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full bg-gold-400 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovered ? '8px' : '5px',
          height: isHovered ? '8px' : '5px',
          boxShadow: '0 0 10px #D4AF37',
        }}
      />
      {/* Trailing Outer Ring */}
      <div
        className="fixed pointer-events-none z-[9998] rounded-full border border-gold-400/50 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHovered ? '48px' : '30px',
          height: isHovered ? '48px' : '30px',
          backgroundColor: isHovered ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
        }}
      />
    </>
  );
}
