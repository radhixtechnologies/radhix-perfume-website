import React, { useEffect, useState } from 'react';

export default function IntroLoader({ onComplete }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
      if (onComplete) onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-dark-950 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700">
      
      {/* Official Brand Logo Drawing Effect */}
      <div className="relative flex flex-col items-center">
        <img
          src="/bnnlogo.png"
          alt="Boss N Buzz Originals"
          className="w-48 sm:w-60 h-auto object-contain filter drop-shadow-[0_0_35px_rgba(212,175,55,0.65)] animate-pulse mb-3"
        />
        <p className="text-[10px] tracking-[0.35em] text-gold-400 uppercase font-semibold">
          INDIAN LUXURY HAUTE PARFUMERIE
        </p>

        {/* Loading line */}
        <div className="w-48 h-0.5 bg-dark-800 rounded-full mt-6 overflow-hidden">
          <div className="w-full h-full bg-gold-gradient animate-shimmer" />
        </div>
      </div>

    </div>
  );
}
