import { motion } from "motion/react";
import { ProductCard } from "./ProductCard";
import { SlideCarousel } from "./SlideCarousel";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { CATALOG, DECK, TEXT } from "../constants";

interface CollectionScreenProps {
  show: boolean;
  /** Los videos solo se reproducen si la pantalla está a la vista y el catálogo no la tapa. */
  videosOn: boolean;
  onBack: () => void;
  onOpenCatalog: () => void;
}

/** Celulares (vertical) y celulares en horizontal: una tarjeta grande en vez del mazo de 3. */
const COMPACT = "(max-width: 639px), (max-height: 520px)";

const BTN =
  "flex cursor-pointer items-center rounded-full border border-black/20 bg-white/65 px-5 py-2.5 font-anton text-base whitespace-nowrap text-black transition-all duration-300 hover:scale-105 hover:border-black/40 hover:text-black/70 active:scale-95 sm:px-8 sm:py-3 sm:text-xl";

export default function CollectionScreen({
  show,
  videosOn,
  onBack,
  onOpenCatalog,
}: CollectionScreenProps) {
  const compact = useMediaQuery(COMPACT);

  return (
    <motion.div
      className="gpu absolute inset-0 z-30 flex h-full w-full flex-col overflow-hidden bg-gradient-to-b from-[#d5effd] via-[#aedcf9] to-[#8cd0f7]"
      initial={{ y: "100%", visibility: "hidden" }}
      // Fuera de pantalla queda oculta: el navegador no la compone ni la pinta.
      animate={
        show
          ? { y: 0, visibility: "visible" }
          : { y: "100%", transitionEnd: { visibility: "hidden" } }
      }
      transition={{ type: "spring", damping: 32, stiffness: 220 }}
    >
      <header className="collection-header">
        <button type="button" onClick={onBack} className={BTN}>
          {TEXT.back}
        </button>
        <button type="button" onClick={onOpenCatalog} className={BTN}>
          {TEXT.catalog}
        </button>
      </header>

      <div className="stage select-none">
        <h2 className="giant font-anton bg-gradient-to-b from-white via-white/70 to-white/0 bg-clip-text text-transparent">
          <span>{TEXT.collection[0]}</span> <span>{TEXT.collection[1]}</span>
        </h2>

        {compact ? (
          <SlideCarousel videosOn={videosOn} />
        ) : (
          <div className="deck">
            {DECK.map(({ itemId, ...card }) => {
              const item = CATALOG.find((i) => i.id === itemId);
              if (!item) return null;
              return (
                <ProductCard
                  key={itemId}
                  {...card}
                  name={item.name}
                  price={item.price}
                  photo={item.photo}
                  alt={item.alt}
                  videosOn={videosOn}
                />
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
