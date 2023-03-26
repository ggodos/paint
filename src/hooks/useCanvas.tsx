import { useRef, useEffect, RefObject, MutableRefObject } from "react";

function useCanvas(): [
  MutableRefObject<HTMLCanvasElement | null>,
  MutableRefObject<CanvasRenderingContext2D | null>
] {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
  }, []);

  return [canvasRef, ctxRef];
}

export default useCanvas;
