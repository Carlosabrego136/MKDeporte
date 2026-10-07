import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { HeroScreen } from "./components/HeroScreen";

const loadCollection = () => import("./components/CollectionScreen");
const CollectionScreen = lazy(loadCollection);

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [collectionMounted, setCollectionMounted] = useState(false);

  const handleStart = useCallback(() => {
    // Descarga el chunk de la 2ª pantalla mientras corre el video.
    void loadCollection();
    setCollectionMounted(true);
    setIsPlaying(true);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setShowSecondScreen(true);
  }, []);

  const handleBack = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setShowSecondScreen(false);
    setIsPlaying(false);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <HeroScreen
        videoRef={videoRef}
        isPlaying={isPlaying}
        onStart={handleStart}
        onEnded={handleEnded}
      />
      {collectionMounted && (
        <Suspense fallback={null}>
          <CollectionScreen show={showSecondScreen} onBack={handleBack} />
        </Suspense>
      )}
    </main>
  );
}
