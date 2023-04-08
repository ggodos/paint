interface Tool {
  name: string;
  description: string;
  icon: string;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  setCanvas: (canvas: HTMLCanvasElement | null) => void;
  // onstart: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  // onend: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  onmousemove: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  ontouchmove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
}

interface ToolProp<T> {
  get: () => T;
  set: () => void;
}
