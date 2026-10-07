import { memo, useEffect, useRef, useState, type RefObject } from "react";
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
  const layerRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const isReady = useHls(videoRef, HERO_VIDEO_URL);

  // Parallax solo con puntero fino (escritorio). Sin estado de React: rAF + transform (GPU).
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const container = containerRef.current;
    const layer = layerRef.current;
    if (!container || !layer) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      raf = 0;
      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
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
  }, []);

  // Respaldo: si el usuario pulsó antes de que el stream estuviera listo, reproduce al estarlo.
  useEffect(() => {
    if (isPlaying && isReady) {
      videoRef.current?.play().catch(() => {});
    }
  }, [isPlaying, isReady, videoRef]);

  return (
    <div
      ref={containerRef}
      className="relative h-dvh w-full overflow-hidden bg-black select-none"
    >
      {/* Capa de fondo: el póster SIEMPRE se ve (también en móvil/iOS, donde el video no precarga). */}
      <div ref={layerRef} className="parallax-layer gpu absolute inset-0">
        <img
          src={POSTER_URL}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          ref={videoRef}
          poster={POSTER_URL}
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
          onPlaying={() => setHasPlayed(true)}
          onEnded={onEnded}
          className={`absolute inset-0 h-full w-full origin-center object-cover transition-opacity duration-1000 ease-in-out ${
            hasPlayed ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      <div className="hero-ui pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
        <motion.div
          className="gpu pointer-events-auto max-w-xs overflow-hidden sm:max-w-sm md:max-w-md"
          animate={isPlaying ? { y: 250, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE_OUT }}
        >
          <h2 className="font-anton text-xl leading-[0.95] tracking-wide text-white uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.35)] sm:text-2xl md:text-3xl lg:text-[2.2rem]">
            {TEXT.slogan.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </motion.div>

        <div className="relative flex w-full items-end justify-between">
          <motion.div
            className="gpu pointer-events-auto overflow-hidden"
            animate={
              isPlaying ? { y: "150%", opacity: 0 } : { y: 0, opacity: 1 }
            }
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            <h1 className="hero-title font-anton text-left text-white uppercase [text-shadow:0_2px_20px_rgba(0,0,0,0.3)]">
              <span className="block">{BRAND.left[0]}</span>
              <span className="block">{BRAND.left[1]}</span>
            </h1>
          </motion.div>

          <motion.div
            className="gpu pointer-events-auto overflow-hidden"
            animate={
              isPlaying ? { y: "150%", opacity: 0 } : { y: 0, opacity: 1 }
            }
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            <p className="hero-title font-anton text-right text-white uppercase [text-shadow:0_2px_20px_rgba(0,0,0,0.3)]">
              <span className="block">{BRAND.right[0]}</span>
              <span className="block">{BRAND.right[1]}</span>
            </p>
          </motion.div>
        </div>

        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              key="start"
              className="hero-start gpu pointer-events-auto"
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE_BOUNCE }}
            >
              <button
                type="button"
                onClick={onStart}
                aria-label="Ver colección"
                className="group relative flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-full border border-white/20 bg-black/90 font-anton text-xs tracking-widest text-white shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-black sm:h-32 sm:w-32 sm:text-sm md:h-36 md:w-36"
              >
                <span className="absolute inset-0 bg-radial from-white/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10 text-center leading-tight font-bold tracking-wider">
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
  );
}

export const HeroScreen = memo(HeroScreenBase);
