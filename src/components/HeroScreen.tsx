import { memo, useEffect, useRef, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useHls } from "../hooks/useHls";
import {
  BRAND,
  EASE_BOUNCE,
  EASE_OUT,
  HERO_VIDEO_URL,
  POSTER_URL,
  TEXT,
} from "../constants";

interface HeroScreenProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  onStart: () => void;
  onEnded: () => void;
}

const MAX_PARALLAX = 20;

function HeroScreenBase({
  videoRef,
  isPlaying,
  onStart,
  onEnded,
}: HeroScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoaded = useHls(videoRef, HERO_VIDEO_URL);

  // Parallax: sin estado de React; rAF + transform directo (GPU).
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      raf = 0;
      video.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (e: MouseEvent) => {
      const hw = window.innerWidth / 2;
      const hh = window.innerHeight / 2;
      x = ((e.clientX - hw) / hw) * MAX_PARALLAX;
      y = ((e.clientY - hh) / hh) * MAX_PARALLAX;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    container.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      container.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [videoRef]);

  // Reproduce cuando el usuario pulsó y el stream ya está listo.
  useEffect(() => {
    if (isPlaying && isLoaded) {
      videoRef.current?.play().catch(() => {});
    }
  }, [isPlaying, isLoaded, videoRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen bg-black overflow-hidden select-none"
    >
      <video
        ref={videoRef}
        poster={POSTER_URL}
        muted
        playsInline
        preload="auto"
        onEnded={onEnded}
        className={`gpu w-full h-full object-cover scale-[1.08] origin-center transition-opacity duration-1000 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      <div className="absolute inset-0 z-10 pointer-events-none p-6 sm:p-12 md:p-16 flex flex-col justify-between">
        <motion.div
          className="gpu max-w-xs sm:max-w-sm md:max-w-md pointer-events-auto overflow-hidden"
          animate={isPlaying ? { y: 250, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE_OUT }}
        >
          <h2 className="font-anton text-white text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] leading-[0.95] tracking-wide uppercase">
            {TEXT.slogan.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </motion.div>

        <div className="relative w-full flex flex-col md:flex-row md:items-end md:justify-between">
          <motion.div
            className="gpu pointer-events-auto overflow-hidden"
            animate={
              isPlaying ? { y: "150%", opacity: 0 } : { y: 0, opacity: 1 }
            }
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            <h1 className="font-anton text-white text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none tracking-tight uppercase">
              <span className="block">{BRAND.line1}</span>
              <span className="block">{BRAND.line2}</span>
            </h1>
          </motion.div>

          <motion.div
            className="gpu text-left md:text-right pointer-events-auto overflow-hidden"
            animate={
              isPlaying ? { y: "150%", opacity: 0 } : { y: 0, opacity: 1 }
            }
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            <p className="font-anton text-white text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none tracking-tight uppercase">
              <span className="block">{BRAND.right1}</span>
              <span className="block">{BRAND.right2}</span>
            </p>
          </motion.div>

          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                key="start"
                className="gpu absolute left-1/2 bottom-[15%] md:bottom-2 -translate-x-1/2 z-20 pointer-events-auto"
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE_BOUNCE }}
              >
                <button
                  type="button"
                  onClick={onStart}
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-black/90 hover:bg-black text-white font-anton text-xs sm:text-sm tracking-widest flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 border border-white/20 hover:border-white/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-sm relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-radial from-white/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 font-bold tracking-wider text-center leading-tight">
                    {TEXT.start[0]}
                    <br />
                    {TEXT.start[1]}
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export const HeroScreen = memo(HeroScreenBase);
