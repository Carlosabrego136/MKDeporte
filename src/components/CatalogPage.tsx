import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  BRAND,
  CATALOG,
  CATEGORIES,
  WHATSAPP_NUMBER,
  pexelsSrc,
  pexelsSrcSet,
  type CatalogItem,
  type CategoryFilter,
} from "../constants";

interface CatalogPageProps {
  show: boolean;
  onClose: () => void;
}

const WIDTHS = [600, 900, 1260] as const;

const CatalogItemCard = memo(function CatalogItemCard({
  item,
}: {
  item: CatalogItem;
}) {
  const waHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hola, me interesa ${item.name} (${item.price})`,
      )}`
    : null;

  return (
    <li className="group overflow-hidden rounded-3xl border-[6px] border-white bg-white shadow-[0_15px_40px_rgba(0,0,0,0.12)] sm:border-[8px]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sky-100">
        <img
          src={pexelsSrc(item.photo, 900)}
          srcSet={pexelsSrcSet(item.photo, WIDTHS)}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
          alt={item.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="px-1.5 pt-3 pb-1.5 sm:px-2">
        <h3 className="font-anton text-[clamp(0.95rem,3.8vw,1.25rem)] leading-tight tracking-wide text-black uppercase sm:text-xl">
          {item.name}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-anton text-sm tracking-widest text-black/60">
            {item.price}
          </span>
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-black px-4 py-1.5 font-anton text-xs tracking-widest text-white transition-transform hover:scale-105 active:scale-95"
            >
              PEDIR
            </a>
          )}
        </div>
      </div>
    </li>
  );
});

export default function CatalogPage({ show, onClose }: CatalogPageProps) {
  const [filter, setFilter] = useState<CategoryFilter>("todo");
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () =>
      filter === "todo" ? CATALOG : CATALOG.filter((i) => i.category === filter),
    [filter],
  );

  // Escape cierra el catálogo; el listener solo existe mientras está abierto.
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [filter]);

  return (
    <motion.div
      className="gpu fixed inset-0 z-50 bg-gradient-to-b from-[#d5effd] via-[#aedcf9] to-[#8cd0f7]"
      initial={{ y: "100%" }}
      animate={show ? { y: 0 } : { y: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 220 }}
      aria-hidden={!show}
      inert={!show}
    >
      <div
        ref={scrollRef}
        className="no-scrollbar h-full overflow-x-hidden overflow-y-auto overscroll-contain"
      >
        <header className="sticky top-0 z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-white/30 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-md sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="flex w-fit cursor-pointer items-center rounded-full border border-black/20 bg-white/40 px-4 py-2 font-anton text-sm whitespace-nowrap text-black transition-all duration-300 hover:scale-105 hover:border-black/40 active:scale-95 sm:px-6 sm:text-lg"
          >
            ← VOLVER
          </button>
          <span className="font-anton text-xl tracking-widest text-black sm:text-3xl">
            {BRAND.name}
          </span>
          <span aria-hidden="true" />
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-8">
          <h1 className="text-center font-anton text-[clamp(2.25rem,9vw,5rem)] leading-none text-black uppercase">
            ROPA DEPORTIVA
            <br />
            DE MUJER
          </h1>
          <p className="mt-3 text-center font-anton text-sm tracking-widest text-balance text-black/60 uppercase sm:text-base">
            Leggins · Shorts · Tops · Conjuntos
          </p>

          <div
            role="tablist"
            aria-label="Categorías"
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={`cursor-pointer rounded-full border px-5 py-2 font-anton text-sm tracking-wider transition-all duration-300 active:scale-95 sm:text-base ${
                  filter === c.id
                    ? "border-black bg-black text-white"
                    : "border-black/20 bg-white/40 text-black hover:border-black/40"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <CatalogItemCard key={item.id} item={item} />
            ))}
          </ul>

          <footer className="mt-12 text-center font-anton text-xs tracking-widest text-black/50 uppercase">
            © {BRAND.name} · Fotos: Pexels
          </footer>
        </main>
      </div>
    </motion.div>
  );
}
