import React, { useEffect, useRef, useState } from 'react';
import { initializeFlip } from './flip';

export const FlipCounter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<
    ((value: number, options?: { direction: 'up' | 'down' }) => void) | null
  >(null);
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const { trigger } = initializeFlip(container, currentNumber);
    triggerRef.current = trigger;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextNumber = currentNumber + 1;

      if (triggerRef.current) {
        triggerRef.current(currentNumber, { direction: 'up' });
      }

      setCurrentNumber(nextNumber);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentNumber]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    />
  );
};
