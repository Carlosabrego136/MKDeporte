import { motion } from "motion/react";
import { ProductCard } from "./ProductCard";
import { PRODUCTS, TEXT } from "../constants";

interface CollectionScreenProps {
  show: boolean;
  onBack: () => void;
}

export default function CollectionScreen({
  show,
  onBack,
}: CollectionScreenProps) {
  return (
    <motion.div
      className="gpu absolute inset-0 w-full h-full z-30 flex flex-col items-center justify-start p-6 pt-24 sm:p-12 md:p-16 bg-gradient-to-b from-[#d5effd] via-[#aedcf9] to-[#8cd0f7]"
      initial={{ y: "100%" }}
      animate={show ? { y: 0 } : { y: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 220 }}
    >
      <button
        type="button"
        onClick={onBack}
        className="absolute top-[56px] left-1/2 -translate-x-1/2 z-40 flex items-center font-anton text-black hover:text-black/70 text-lg sm:text-xl border border-black/20 hover:border-black/40 px-8 py-3 rounded-full bg-white/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        {TEXT.back}
      </button>

      <div className="w-full flex-1 flex flex-col items-center justify-center relative select-none mt-20 sm:mt-16">
        <h2 className="font-anton select-none pointer-events-none uppercase text-[13.5vw] sm:text-[16.9vw] leading-none text-center w-full absolute z-10 whitespace-nowrap bg-gradient-to-b from-white via-white/70 to-white/0 bg-clip-text text-transparent transform translate-y-4 filter drop-shadow-[0_2px_15px_rgba(255,255,255,0.1)]">
          {TEXT.collection}
        </h2>

        <div className="flex items-center justify-center relative z-20 w-full max-w-5xl mt-6">
          {PRODUCTS.map(({ id, ...product }) => (
            <ProductCard key={id} {...product} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
