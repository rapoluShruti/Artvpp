import { useEffect, useRef, useState } from "react";

const PROJECTS = [
  {
    title: "Redroom Gesture",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  },
  {
    title: "Shadowwear",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },
  {
    title: "Blur Formation",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
  },
];

export function InfiniteHero() {
  const [offset, setOffset] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      setOffset((v) => v - e.deltaY * 0.6);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-black text-white">
      {PROJECTS.map((item, i) => (
        <div
          key={i}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${offset + i * window.innerHeight}px)`,
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover scale-150"
          />
          <div className="absolute bottom-16 left-16">
            <h1 className="text-5xl font-bold tracking-tight">
              {item.title}
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
}
