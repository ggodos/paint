import Vector2 from "types/Vector2";
import { Figure } from "./Figure";

export class Drawing {
  figures: Array<Figure> = [];
  constructor(figures: Array<Figure>) {
    this.figures = figures;
  }
  draw(ctx: CanvasRenderingContext2D, scale: (p: Vector2) => Vector2) {
    this.figures.forEach((figure) => figure.draw(ctx, scale));
  }
  addFigure(figure: Figure) {
    this.figures.push(figure);
  }
}
