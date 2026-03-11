import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 1.5, decimals = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        
        // ease out quart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        setDisplayValue(easeOut * value);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {displayValue.toFixed(decimals)}
    </span>
  );
};

export default AnimatedCounter;
