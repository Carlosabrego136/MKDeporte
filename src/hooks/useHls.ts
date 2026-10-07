import { useEffect, useRef, useState, type RefObject } from "react";
import type HlsType from "hls.js";

const NATIVE_MIME = "application/vnd.apple.mpegurl";

/**
 * Conecta un stream HLS a un <video>.
 * - Safari/iOS (WebKit): HLS nativo, es lo más eficiente y lo único fiable en iPhone.
 * - Resto (Android/Chrome/Firefox): hls.js. Aunque Chrome Android diga que soporta HLS
 *   nativo, hls.js es mucho más estable (buffer, calidad adaptable, reintentos).
 * - `enabled=false` no hace nada (carga diferida bajo demanda).
 * - `onFatal` se llama si el stream no se puede recuperar.
 * Limpia todo al desmontar o cambiar de fuente.
 */
export function useHls(
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string,
  enabled = true,
  onFatal?: () => void,
): boolean {
  const [isReady, setIsReady] = useState(false);
  const onFatalRef = useRef(onFatal);

  useEffect(() => {
    onFatalRef.current = onFatal;
  });

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let hls: HlsType | null = null;
    let usedNative = false;
    const canNative = video.canPlayType(NATIVE_MIME) !== "";

    const attachNative = () => {
      usedNative = true;
      video.src = src;
      setIsReady(true);
    };

    if (canNative && /Apple/i.test(navigator.vendor)) {
      attachNative();
    } else {
      import("hls.js")
        .then(({ default: Hls }) => {
          if (cancelled) return;
          if (!Hls.isSupported()) {
            if (canNative) attachNative();
            else onFatalRef.current?.();
            return;
          }

          const instance = new Hls({
            // Mueve el demux/transmux fuera del hilo principal (menos tirones en el celular).
            enableWorker: true,
            // No pedir calidades mayores a lo que cabe en pantalla (clave en celulares).
            capLevelToPlayerSize: true,
            maxBufferLength: 20,
            maxMaxBufferLength: 30,
            backBufferLength: 10,
          });
          hls = instance;

          let netRetries = 0;
          let mediaRetries = 0;
          instance.on(Hls.Events.MANIFEST_PARSED, () => setIsReady(true));
          instance.on(Hls.Events.ERROR, (_event, data) => {
            if (!data.fatal) return;
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR && netRetries < 3) {
              netRetries += 1;
              instance.startLoad();
            } else if (
              data.type === Hls.ErrorTypes.MEDIA_ERROR &&
              mediaRetries < 2
            ) {
              mediaRetries += 1;
              instance.recoverMediaError();
            } else {
              instance.destroy();
              hls = null;
              onFatalRef.current?.();
            }
          });
          instance.loadSource(src);
          instance.attachMedia(video);
        })
        .catch(() => onFatalRef.current?.());
    }

    return () => {
      cancelled = true;
      hls?.destroy();
      hls = null;
      if (usedNative) {
        video.removeAttribute("src");
        video.load();
      }
      setIsReady(false);
    };
  }, [videoRef, src, enabled]);

  return isReady;
}
