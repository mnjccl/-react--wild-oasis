import { RefObject, useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(
  handler: () => void,
  listenCapturing: boolean
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        const target = e.target as Node;
        if (ref.current && !ref.current.contains(target)) handler();
      }
      document.addEventListener("click", handleClick, listenCapturing);
      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
