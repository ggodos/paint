interface Drawing {
  draw: (ctx: CanvasRenderingContext2D, scale: (p: Point) => Point) => void;
}
