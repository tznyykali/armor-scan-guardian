import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface ScanStats {
  malicious: number;
  harmless: number;
  suspicious: number;
  undetected: number;
}

const NetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const location = useLocation();
  const [isMalicious, setIsMalicious] = React.useState(false);
  const animationSpeedRef = useRef(0.5); // Default speed

  useEffect(() => {
    // Only check for malicious content on the results page
    if (location.pathname === '/results') {
      const checkLatestScan = async () => {
        const { data, error } = await supabase
          .from('current_scan_results')
          .select('threat_category')
          .order('scan_timestamp', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const isMaliciousContent = data[0].threat_category === 'malware';
          setIsMalicious(isMaliciousContent);
          // Increase animation speed if malicious content detected
          animationSpeedRef.current = isMaliciousContent ? 2 : 0.5;
        }
      };

      checkLatestScan();
    } else {
      setIsMalicious(false);
      animationSpeedRef.current = 0.5;
    }
  }, [location.pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle system
    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 100;
    const connectionDistance = 200;
    const particleSize = 3;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Move particle with dynamic speed
        particle.x += particle.vx * animationSpeedRef.current;
        particle.y += particle.vy * animationSpeedRef.current;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle with theme-aware and malicious-aware colors
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
        
        if (isMalicious) {
          // Pulsing red effect for malicious content
          const pulseIntensity = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(255, 0, 0, ${pulseIntensity})`;
        } else {
          ctx.fillStyle = theme === 'dark' 
            ? 'rgba(220, 228, 201, 0.6)' // sage light color for dark mode
            : 'rgba(224, 123, 57, 0.6)'; // rust color for light mode
        }
        ctx.fill();

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            if (isMalicious) {
              // Pulsing red connections for malicious content
              const pulseIntensity = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
              ctx.strokeStyle = `rgba(255, 0, 0, ${0.3 * (1 - distance / connectionDistance) * pulseIntensity})`;
            } else {
              ctx.strokeStyle = theme === 'dark'
                ? `rgba(220, 228, 201, ${0.3 * (1 - distance / connectionDistance)})` // sage light color for dark mode
                : `rgba(224, 123, 57, ${0.3 * (1 - distance / connectionDistance)})`; // rust color for light mode
            }
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [theme, isMalicious]); // Add isMalicious as dependency

  return (
    <div className="fixed inset-0 z-0">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${
          isMalicious 
            ? 'opacity-60 mix-blend-color-dodge' 
            : 'opacity-40 mix-blend-multiply dark:mix-blend-screen'
        }`}
      />
    </div>
  );
};

export default NetworkBackground;
