import { memo, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useHls } from "../hooks/useHls";
import {
  pexelsSrc,
  pexelsSrcSet,
  type DeckCardConfig,
  type CatalogItem,
} from "../constants";

type ProductCardProps = Omit<DeckCardConfig, "itemId"> &
  Pick<CatalogItem, "name" | "price" | "photo" | "alt">;

const SRC_WIDTHS = [600, 900, 1260] as const;

function ProductCardBase({
  video,
  name,
  price,
  photo,
  alt,
  position,
  initialRotation,
  hoverOffset,
  zIndexClass,
}: ProductCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  // El stream solo se conecta tras el primer hover/toque (carga bajo demanda).
  const isReady = useHls(videoRef, video, hasActivated);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isReady) return;
    if (isHovered) {
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isHovered, isReady]);

  const handleHoverStart = () => {
    setHasActivated(true);
    setIsHovered(true);
  };
  const handleHoverEnd = () => {
    setIsHovered(false);
    setVideoOn(false);
  };

  // En pantallas táctiles (sin hover) el toque alterna la reproducción.
  const handleClick = () => {
    if (window.matchMedia("(hover: none)").matches) {
      setHasActivated(true);
      setIsHovered((v) => !v);
      if (isHovered) setVideoOn(false);
    }
  };

  return (
    <motion.div
      className={`deck-card deck-card--${position} gpu relative aspect-[9/16] origin-bottom cursor-pointer overflow-hidden rounded-3xl border-[6px] border-white bg-white shadow-[0_15px_40px_rgba(0,0,0,0.22)] select-none sm:border-[8px] ${zIndexClass}`}
      initial={{ rotate: initialRotation, x: 0, y: 0, scale: 1 }}
      whileHover={{
        ...hoverOffset,
        transition: { type: "spring", stiffness: 200, damping: 20 },
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={handleClick}
    >
      {/* Foto real HD: siempre visible; el video aparece encima al reproducir */}
      <img
        src={pexelsSrc(photo, 900)}
        srcSet={pexelsSrcSet(photo, SRC_WIDTHS)}
        sizes="(max-width: 640px) 45vw, 24rem"
        alt={alt}
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="none"
        onPlaying={() => setVideoOn(true)}
        className={`pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover transition-opacity duration-500 ${
          videoOn ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/10" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/75 via-black/30 to-transparent p-[0.9em] pt-[3.5em]"
        style={{ fontSize: "clamp(0.8rem, calc(var(--card-w) * 0.075), 1.5rem)" }}
      >
        <p className="font-anton leading-none tracking-wide text-white uppercase">
          {name}
        </p>
        <p className="mt-[0.35em] font-anton text-[0.7em] tracking-widest text-white/85 uppercase">
          {price}
        </p>
      </div>
    </motion.div>
  );
}

export const ProductCard = memo(ProductCardBase);
