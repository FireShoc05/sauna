import React, { useRef, useEffect } from 'react';

const SteamParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      maxOpacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 200;
        this.size = Math.random() * 100 + 50; // Large particles
        this.speedX = Math.random() * 0.4 - 0.2; // Slow horizontal drift
        this.speedY = Math.random() * 0.5 + 0.2; // Slow rising speed (15-25s equivalent)
        this.maxOpacity = Math.random() * 0.08 + 0.02; // max 0.10 opacity (very subtle)
        this.opacity = 0;
      }

      update() {
        this.x += this.speedX;
        this.y -= this.speedY;
        
        // Fade in
        if (this.opacity < this.maxOpacity && this.y > height * 0.1) {
          this.opacity += 0.001;
        }
        
        // Fade out near top
        if (this.y < height * 0.3) {
          this.opacity -= 0.001;
        }

        if (this.y + this.size < 0 || this.opacity <= 0 && this.y < height * 0.5) {
          this.y = height + Math.random() * 100;
          this.x = Math.random() * width;
          this.opacity = 0;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, 'rgba(240, 237, 232, 0.2)'); // off-white
        gradient.addColorStop(1, 'rgba(240, 237, 232, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particlesArray: Particle[] = [];
    const numberOfParticles = 40; // less particles, bigger size for fog effect

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

export default SteamParticles;
