import Vector2 from "types/Vector2";

export interface Figure {
  draw: (ctx: CanvasRenderingContext2D, scale: (p: Vector2) => Vector2) => void;
}
