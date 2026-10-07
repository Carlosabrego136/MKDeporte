import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { HeroScreen } from "./components/HeroScreen";
import { WhatsAppWidget } from "./components/WhatsAppWidget";
import { CATALOG, pexelsSrc } from "./constants";

const loadCollection = () => import("./components/CollectionScreen");
const loadCatalog = () => import("./components/CatalogPage");
const CollectionScreen = lazy(loadCollection);
const CatalogPage = lazy(loadCatalog);

/** Deja listas las primeras fotos del catálogo para que abra sin "saltos". */
function preloadCatalogImages() {
  CATALOG.slice(0, 4).forEach((item) => {
    const img = new Image();
    img.decoding = "async";
    img.src = pexelsSrc(item.photo, 600);
  });
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [collectionMounted, setCollectionMounted] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalogMounted, setCatalogMounted] = useState(false);

  const handleStart = useCallback(() => {
    // play() dentro del gesto del usuario: imprescindible en iOS/Safari.
    // Si el navegador lo bloquea, no dejamos al usuario atascado: pasamos a la colección.
    videoRef.current?.play().catch((err: unknown) => {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setIsPlaying(false);
        setShowSecondScreen(true);
        setCollectionMounted(true);
      }
    });
    void loadCollection(); // solo descarga el código (3 kB); no monta nada todavía
    setIsPlaying(true);
  }, []);

  // La pantalla 2 se monta un poco después de arrancar el video, para no competir
  // con el inicio del stream (red y CPU del celular).
  useEffect(() => {
    if (!isPlaying || collectionMounted) return;
    const t = window.setTimeout(() => setCollectionMounted(true), 1500);
    return () => window.clearTimeout(t);
  }, [isPlaying, collectionMounted]);

  const handleEnded = useCallback(() => {
    videoRef.current?.pause();
    setCollectionMounted(true);
    setIsPlaying(false);
    setShowSecondScreen(true);
    void loadCatalog(); // precarga el catálogo mientras el usuario ve la colección
    window.setTimeout(preloadCatalogImages, 800);
  }, []);

  const handleBack = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setShowCatalog(false);
    setShowSecondScreen(false);
    setIsPlaying(false);
  }, []);

  const openCatalog = useCallback(() => {
    setCatalogMounted(true);
    setShowCatalog(true);
  }, []);

  const closeCatalog = useCallback(() => setShowCatalog(false), []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      <HeroScreen
        videoRef={videoRef}
        isPlaying={isPlaying}
        onStart={handleStart}
        onEnded={handleEnded}
      />
      {collectionMounted && (
        <Suspense fallback={null}>
          <CollectionScreen
            show={showSecondScreen}
            videosOn={showSecondScreen && !showCatalog}
            onBack={handleBack}
            onOpenCatalog={openCatalog}
          />
        </Suspense>
      )}
      {catalogMounted && (
        <Suspense fallback={null}>
          <CatalogPage show={showCatalog} onClose={closeCatalog} />
        </Suspense>
      )}
      <WhatsAppWidget />
    </main>
  );
}
