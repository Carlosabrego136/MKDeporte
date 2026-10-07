import { useEffect, useState, type RefObject } from "react";
import type HlsType from "hls.js";

/**
 * Conecta un stream HLS a un <video>.
 * - Safari/iOS: HLS nativo (no descarga hls.js).
 * - Resto: importa hls.js de forma dinámica (chunk separado).
 * - `enabled=false` no hace nada (carga diferida bajo demanda).
 * Limpia todo al desmontar o cambiar de fuente.
 */
export function useHls(
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string,
  enabled = true,
): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let hls: HlsType | null = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      const onReady = () => setIsReady(true);
      video.addEventListener("loadedmetadata", onReady, { once: true });
      video.src = src;
      return () => {
        video.removeEventListener("loadedmetadata", onReady);
        video.removeAttribute("src");
        video.load();
        setIsReady(false);
      };
    }

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled || !Hls.isSupported()) return;
      hls = new Hls({ enableWorker: false });
      hls.on(Hls.Events.MANIFEST_PARSED, () => setIsReady(true));
      hls.loadSource(src);
      hls.attachMedia(video);
    });

    return () => {
      cancelled = true;
      hls?.destroy();
      hls = null;
      setIsReady(false);
    };
  }, [videoRef, src, enabled]);

  return isReady;
}
