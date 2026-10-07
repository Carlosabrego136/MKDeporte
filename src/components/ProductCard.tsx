import { memo, useState } from "react";
import { motion } from "motion/react";
import { useCardVideo } from "../hooks/useCardVideo";
import {
  pexelsSrc,
  pexelsSrcSet,
  type DeckCardConfig,
  type CatalogItem,
} from "../constants";

type ProductCardProps = Omit<DeckCardConfig, "itemId"> &
  Pick<CatalogItem, "name" | "price" | "photo" | "alt"> & {
    /** false mientras otra pantalla (catálogo) está encima: el video se pausa. */
    videosOn: boolean;
  };

const SRC_WIDTHS = [600, 900, 1260] as const;

/** Tarjeta del mazo de 3 (escritorio / tablet): hover = video. */
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
  videosOn,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { ref, videoOn, onPlaying } = useCardVideo(video, isHovered && videosOn);

  return (
    <motion.div
      className={`deck-card deck-card--${position} gpu relative aspect-[9/16] origin-bottom cursor-pointer overflow-hidden rounded-3xl border-[6px] border-white bg-white shadow-[0_15px_40px_rgba(0,0,0,0.22)] select-none sm:border-[8px] ${zIndexClass}`}
      initial={{ rotate: initialRotation, x: 0, y: 0, scale: 1 }}
      whileHover={{
        ...hoverOffset,
        transition: { type: "spring", stiffness: 200, damping: 20 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Foto real HD: siempre visible; el video aparece encima al reproducir */}
      <img
        src={pexelsSrc(photo, 900)}
        srcSet={pexelsSrcSet(photo, SRC_WIDTHS)}
        sizes="(max-width: 1024px) 34vw, 24rem"
        alt={alt}
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover"
      />
      <video
        ref={ref}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="none"
        onPlaying={onPlaying}
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
