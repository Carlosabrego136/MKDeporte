import { memo, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useHls } from "../hooks/useHls";
import type { ProductConfig } from "../constants";

type ProductCardProps = Omit<ProductConfig, "id">;

function ProductCardBase({
  src,
  name,
  price,
  initialRotation,
  hoverOffset,
  zIndexClass,
  className = "",
}: ProductCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);

  // El stream solo se conecta tras el primer hover (carga bajo demanda).
  const isReady = useHls(videoRef, src, hasActivated);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;
    if (isHovered) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered, isReady]);

  const handleHoverStart = () => {
    setHasActivated(true);
    setIsHovered(true);
  };
  const handleHoverEnd = () => setIsHovered(false);

  // En pantallas táctiles (sin hover) el toque alterna la reproducción.
  const handleClick = () => {
    if (window.matchMedia("(hover: none)").matches) {
      setHasActivated(true);
      setIsHovered((v) => !v);
    }
  };

  return (
    <motion.div
      className={`gpu relative rounded-3xl overflow-hidden aspect-[9/16] w-72 sm:w-[21rem] md:w-[24rem] bg-white border-[6px] sm:border-[8px] border-white shadow-[0_15px_40px_rgba(0,0,0,0.22)] cursor-pointer origin-bottom select-none ${zIndexClass} ${className}`}
      initial={{ rotate: initialRotation, x: 0, y: 0, scale: 1 }}
      whileHover={{
        ...hoverOffset,
        transition: { type: "spring", stiffness: 200, damping: 20 },
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className="w-full h-full object-cover rounded-2xl pointer-events-none"
      />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-4 pt-16 rounded-b-2xl bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
        <p className="font-anton text-white uppercase leading-none tracking-wide text-xl sm:text-2xl">
          {name}
        </p>
        <p className="font-anton text-white/80 uppercase tracking-widest text-sm mt-1">
          {price}
        </p>
      </div>
    </motion.div>
  );
}

export const ProductCard = memo(ProductCardBase);
