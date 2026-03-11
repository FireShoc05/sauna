import React, { useRef, useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  maxOffset?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className, maxOffset = 6, ...props }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Calculate distance with a limit out of 1
    const boundedX = Math.max(-1, Math.min(1, middleX / (width / 2)));
    const boundedY = Math.max(-1, Math.min(1, middleY / (height / 2)));

    setPosition({ x: boundedX * maxOffset, y: boundedY * maxOffset });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      {...props as any}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
