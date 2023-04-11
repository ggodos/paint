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

class Brush extends Tool {
  name: string = "Brush";
  description: string = "Draw with a brush";
  icon: string = "brush";
  onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
    if (!this.canvas || !this.ctx) return;

    const trueCursor = toTrue(getCursor());
    const truePrevCursor = toTrue(getPrevCursor());

    const line = new Line(truePrevCursor, trueCursor);
    addDrawing(line);
    line.draw(this.ctx, (a: Point) => toScaled(a));
  }
  onTouchMove(e: React.TouchEvent<HTMLCanvasElement>): void {
    const prevTouches = getPrevTouches();
    const touch0 = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    };

    const prevTouch0 = prevTouches[0];
    const trueTouch0 = toTrue(touch0);
    const truePrevTouch0 = toTrue(prevTouch0);
    const line = new Line(truePrevTouch0, trueTouch0);
    addDrawing(line);
    if (!this.ctx) return;
    line.draw(this.ctx, (a: Point) => toScaled(a));
    prevTouches[0] = touch0;
    // redraw();
  }
}

export default Brush;
