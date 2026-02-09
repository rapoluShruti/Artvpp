import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Extract dominant-ish colors by sampling the GIF (simple heuristic)
const extractColors = (imgSrc, count = 6) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const w = 120;
      const h = 80;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h).data;

      const freq = {};
      for (let i = 0; i < imageData.length; i += 4 * 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const key = `${r},${g},${b}`;
        freq[key] = (freq[key] || 0) + 1;
      }

      const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, count);
      const colors = entries.map((e) => `rgb(${e[0]})`);
      if (colors.length === 0) return resolve(["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"]);
      resolve(colors);
    };
    img.onerror = () => resolve(["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"]);
    img.src = imgSrc;
  });
};

const SplashCanvas = forwardRef(function SplashCanvas({ colors }, refForward) {
  const ref = useRef();
  const particles = useRef([]);
  const rafRef = useRef();

  // emit function defined in component scope so it can be used by imperative handle
  const emit = (x, y, intensity = 1.0) => {
    const c = colors[Math.floor(Math.random() * colors.length)];
    const count = 12 + Math.floor(Math.random() * 18 * (intensity || 1));
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5;
      const r = 8 + Math.random() * 42;
      particles.current.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 100 + Math.random() * 140,
        age: 0,
        r,
        color: c
      });
    }
  };

  // expose emit API to parent via ref (must be called in component body)
  useImperativeHandle(refForward, () => ({
    emitAt: (x, y, intensity = 1) => emit(x, y, intensity)
  }));

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // periodic emitters to create 'splashes' falling from top
    let emitInterval = setInterval(() => {
      const x = window.innerWidth * (0.3 + Math.random() * 0.4);
      const y = 100 + Math.random() * 60;
      emit(x, y, 0.8);
    }, 600 + Math.random() * 500);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.vy += 0.08; // gravity
        p.vx *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        const lifeRatio = 1 - p.age / p.life;
        if (lifeRatio <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.5, p.color + '88');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.75 * lifeRatio;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.7 + Math.random() * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(emitInterval);
      cancelAnimationFrame(rafRef.current);
    };
  }, [colors]);

    return (
      <canvas
        ref={ref}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: 0.9
        }}
      />
    );
  });

export default function HeroSection() {
  const [colors, setColors] = useState(["#ff6b6b", "#222222", "#ffd166", "#84cc16", "#60a5fa"]);
  const [scrollY, setScrollY] = useState(0);
  const boxRefs = useRef([]);
  const canvasRef = useRef();
  const heroTextRef = useRef();

  useEffect(() => {
    extractColors('/a.gif', 6).then((c) => {
      const filtered = c.map(col => {
        if (/^[0-9,]+$/.test(col)) return `rgb(${col})`;
        return col;
      });
      setColors(filtered);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate hero text on load
    if (heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
    }

    // Animate boxes on scroll and trigger splatter on enter
    boxRefs.current.forEach((box, idx) => {
      if (!box) return;
      gsap.fromTo(
        box,
        { opacity: 0, y: 60, scale: 0.94, rotateX: -15 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.9,
          delay: idx * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: box,
            start: "top 82%",
            toggleActions: 'play none none reverse',
            onEnter: () => {
              try {
                const rect = box.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 3;
                canvasRef.current?.emitAt(x, y, 1.2);
              } catch (e) {}
            }
          }
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [colors]);

  const features = [
    { title: "Browse Art", desc: "Discover stunning artwork from talented artists worldwide", icon: "🎨" },
    { title: "Commission Services", desc: "Request custom commissions from your favorite creators", icon: "✨" },
    { title: "Pre-Release Drops", desc: "Get early access to exclusive limited digital products", icon: "🚀" },
    { title: "Download Digital", desc: "Own and download high-quality digital assets instantly", icon: "⬇️" },
    { title: "Secure Payments", desc: "Safe and encrypted payment methods for peace of mind", icon: "🔒" }
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="hero relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url(/a.gif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Gradient overlay for better text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60"
          style={{
            opacity: 1 - scrollY / 800
          }}
        ></div>

        {/* Splatter canvas */}
        <div className="absolute inset-0">
          <SplashCanvas ref={canvasRef} colors={colors} />
        </div>

        {/* Hero Content */}
        <div 
          ref={heroTextRef}
          className="relative z-10 text-center text-white max-w-4xl px-6"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: 1 - scrollY / 500
          }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white">ArtVPP</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-10 font-light opacity-95 leading-relaxed">
            Discover, commission, and own digital art from talented creators worldwide
          </p>
          <button className="group relative bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-95 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105">
            <span className="relative z-10">Explore Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce"
          style={{
            opacity: 1 - scrollY / 300
          }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
    
    </div>
  );
}