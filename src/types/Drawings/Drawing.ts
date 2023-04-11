interface Drawing {
  draw: (ctx: CanvasRenderingContext2D, scale: (p: Vector2) => Vector2) => void;
}
