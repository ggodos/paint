import Vector2 from "types/Vector2";
import Line from "../../types/Drawings/Line";

import {
  setCursor,
  setPrevCursor,
  getCursor,
  getPrevCursor,
  getIsDrawing,
  addDrawing,
  getIsMoving,
  getOffset,
  getScale,
  getMaxScale,
  getMinScale,
  getSingleTouch,
  getDoubleTouch,
  toScaled,
  toTrue,
  trueSize,
  getPrevTouches,
  setScale,
} from "../shared/shared";
import Tool from "./Tool";
import { Drawing } from "types/Drawings/Drawing";

class Brush extends Tool {
  name: string = "Brush";
  description: string = "Draw with a brush";
  icon: string = "brush";
  currentDrawing: Drawing = new Drawing([]);
  onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
    if (!this.canvas || !this.ctx) return;

    const trueCursor = toTrue(getCursor());
    const truePrevCursor = toTrue(getPrevCursor());

    const line = new Line(truePrevCursor, trueCursor);
    this.currentDrawing.addFigure(line);
    line.draw(this.ctx, (a: Vector2) => toScaled(a));
  }
  onMouseEnd(): void {
    addDrawing(this.currentDrawing);
    this.currentDrawing = new Drawing([]);
  }
  onTouchMove(e: React.TouchEvent<HTMLCanvasElement>): void {
    const prevTouches = getPrevTouches();
    const touch0 = new Vector2(e.touches[0].pageX, e.touches[0].pageY);

    const prevTouch0 = prevTouches[0];
    const trueTouch0 = toTrue(touch0);
    const truePrevTouch0 = toTrue(prevTouch0);
    const line = new Line(truePrevTouch0, trueTouch0);
    addDrawing(line);
    if (!this.ctx) return;
    line.draw(this.ctx, (a: Vector2) => toScaled(a));
    prevTouches[0] = touch0;
    // redraw();
  }
}

export default Brush;
