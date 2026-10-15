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
      
      {/* Monogram drawing effect */}
      <div className="relative flex flex-col items-center animate-pulse">
        <div className="w-24 h-24 rounded-full border-2 border-gold-400/80 p-2 bg-dark-900 flex items-center justify-center shadow-gold-glow-lg">
          <span className="font-cinzel text-gold-300 font-black text-3xl tracking-widest">
            BNB
          </span>
        </div>

        <h1 className="font-cinzel text-xl md:text-2xl font-black text-cream-50 tracking-[0.3em] mt-5">
          BOSS N BUZZ
        </h1>
        <p className="text-[10px] tracking-[0.4em] text-gold-400 uppercase font-semibold mt-1">
          ORIGINALS • INDIAN LUXURY PARFUMERIE
        </p>

        {/* Loading line */}
        <div className="w-48 h-0.5 bg-dark-800 rounded-full mt-6 overflow-hidden">
          <div className="w-full h-full bg-gold-gradient animate-shimmer" />
        </div>
      </div>

    </div>
  );
}
