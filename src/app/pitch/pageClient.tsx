'use client';

import { useEffect } from 'react';

export default function PitchPageClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable scroll on pitch page for immersive experience
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return <>{children}</>;
}
