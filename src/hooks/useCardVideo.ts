import { useCallback, useEffect, useRef, useState } from "react";
import { useHls } from "./useHls";

/**
 * Video de una tarjeta: no descarga nada hasta que `playing` es true por primera vez;
 * reproduce mientras `playing` y se pausa/reinicia al terminar.
 * `videoOn` indica que ya hay imagen en movimiento (para mostrar el video sobre la foto).
 */
export function useCardVideo(src: string, playing: boolean) {
  const ref = useRef<HTMLVideoElement>(null);
  const [activated, setActivated] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  useEffect(() => {
    if (playing) setActivated(true);
  }, [playing]);

  const isReady = useHls(ref, src, activated);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isReady) return;
    if (playing) {
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
      setVideoOn(false);
    }
  }, [playing, isReady]);

  const onPlaying = useCallback(() => setVideoOn(true), []);

  return { ref, videoOn, onPlaying };
}
