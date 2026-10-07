import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useCardVideo } from "../hooks/useCardVideo";
import {
  CATALOG,
  DECK,
  pexelsSrc,
  pexelsSrcSet,
  type CatalogItem,
} from "../constants";

const SRC_WIDTHS = [600, 900, 1260] as const;

interface SlideProps {
  item: CatalogItem;
  video: string;
  index: number;
  total: number;
  active: boolean;
  videosOn: boolean;
}

/** Una tarjeta grande para celular: foto HD + video automático cuando es la activa. */
const Slide = memo(function Slide({
  item,
  video,
  index,
  total,
  active,
  videosOn,
}: SlideProps) {
  const { ref, videoOn, onPlaying } = useCardVideo(video, active && videosOn);

  return (
    <div className="slide" data-index={index} data-active={active}>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2rem] border-[7px] border-white bg-white shadow-[0_28px_60px_-12px_rgba(20,80,130,0.5)]">
        <img
          src={pexelsSrc(item.photo, 900)}
          srcSet={pexelsSrcSet(item.photo, SRC_WIDTHS)}
          sizes="75vw"
          alt={item.alt}
          decoding="async"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full rounded-3xl object-cover"
        />
        <video
          ref={ref}
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="none"
          onPlaying={onPlaying}
          className={`pointer-events-none absolute inset-0 h-full w-full rounded-3xl object-cover transition-opacity duration-500 ${
            videoOn ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10" />

        <span className="pointer-events-none absolute top-[0.9rem] left-[0.9rem] rounded-full bg-black/40 px-3 py-1 font-anton text-xs tracking-widest text-white">
          0{index + 1} / 0{total}
        </span>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-[0.9em] pt-[4em]"
          style={{ fontSize: "clamp(0.85rem, calc(var(--slide-w) * 0.105), 2.4rem)" }}
        >
          <p className="font-anton leading-[0.95] tracking-wide text-white uppercase">
            {item.name}
          </p>
          <p className="mt-[0.5em] inline-block rounded-full bg-white px-[0.9em] py-[0.25em] font-anton text-[0.55em] tracking-widest text-black uppercase">
            {item.price}
          </p>
        </div>
      </div>
    </div>
  );
});

/**
 * Carrusel con scroll-snap (CSS nativo, sin librerías): una tarjeta grande al centro y las
 * vecinas asomando a los lados. La tarjeta activa reproduce su video sola.
 */
export function SlideCarousel({ videosOn }: { videosOn: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);

  // La flecha de "desliza" se oculta en cuanto la persona cambia de tarjeta.
  useEffect(() => {
    if (active !== 0) setHasSwiped(true);
  }, [active]);

  // La activa es la que se ve en ≥60%. Un solo observer, se desconecta al desmontar.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.6) {
            setActive(Number((e.target as HTMLElement).dataset.index));
          }
        }
      },
      { root: track, threshold: [0.6] },
    );
    track
      .querySelectorAll<HTMLElement>("[data-index]")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = useCallback((i: number) => {
    trackRef.current
      ?.querySelector<HTMLElement>(`[data-index="${i}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  return (
    <div className="carousel-root">
      <div ref={trackRef} className="carousel" aria-roledescription="carrusel">
        {DECK.map((card, i) => {
          const item = CATALOG.find((c) => c.id === card.itemId);
          if (!item) return null;
          return (
            <Slide
              key={card.itemId}
              item={item}
              video={card.video}
              index={i}
              total={DECK.length}
              active={active === i}
              videosOn={videosOn}
            />
          );
        })}
      </div>

      <div className="swipe-hint" data-hidden={hasSwiped} aria-hidden="true">
        <div className="swipe-pill">
          <svg viewBox="0 0 24 24" className="nudge-l" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          <span>DESLIZA</span>
          <svg viewBox="0 0 24 24" className="nudge-r" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="carousel-dots" role="tablist" aria-label="Prendas">
        {DECK.map((card, i) => (
          <button
            key={card.itemId}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`Prenda ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
              active === i ? "w-7 bg-black" : "w-2 bg-black/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
