interface Tool {
  name: string;
  description: string;
  icon: string;
  onmousedown: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  onmousemove: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  onmouseup: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  onmouseleave: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  onwheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
  ontouchstart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  ontouchmove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  ontouchend: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  ontouchcancel: (e: React.TouchEvent<HTMLCanvasElement>) => void;
}

interface ToolProp<T> {
  get: () => T;
  set: () => void;
}
