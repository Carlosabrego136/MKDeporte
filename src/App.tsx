import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { HeroScreen } from "./components/HeroScreen";

const loadCollection = () => import("./components/CollectionScreen");
const loadCatalog = () => import("./components/CatalogPage");
const CollectionScreen = lazy(loadCollection);
const CatalogPage = lazy(loadCatalog);

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [collectionMounted, setCollectionMounted] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalogMounted, setCatalogMounted] = useState(false);

  const handleStart = useCallback(() => {
    // play() dentro del gesto del usuario: imprescindible en iOS/Safari.
    videoRef.current?.play().catch(() => {});
    // Descarga el chunk de la 2ª pantalla mientras corre el video.
    void loadCollection();
    setCollectionMounted(true);
    setIsPlaying(true);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setShowSecondScreen(true);
    void loadCatalog(); // precarga el catálogo mientras el usuario ve la colección
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
    </main>
  );
}
