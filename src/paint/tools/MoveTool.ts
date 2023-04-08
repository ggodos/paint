import {
  getCursor,
  getMaxScale,
  getMinScale,
  getOffset,
  getPrevCursor,
  getPrevTouches,
  getScale,
  setScale,
  toTrue,
  trueSize,
} from "../shared/shared";
import Tool from "./Tool";

class MoveTool extends Tool {
  name: string = "Move";
  description: string = "Move the canvas";
  icon: string = "move";
  onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
    if (!this.canvas || !this.ctx) return;
    const offset = getOffset();
    const trueCursor = toTrue(getCursor());
    const truePrevCursor = toTrue(getPrevCursor());
    offset.x += trueCursor.x - truePrevCursor.x;
    offset.y += trueCursor.y - truePrevCursor.y;
  }
  onTouchMove(
    e: React.TouchEvent<HTMLCanvasElement>,
    updateUIScale?: (newScale: number) => void
  ): void {
    if (e.touches.length < 2) return;
    const prevTouches = getPrevTouches();
    const touch0 = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    };
    const prevTouch0 = prevTouches[0];
    const touch1 = {
      x: e.touches[1].pageX,
      y: e.touches[1].pageY,
    };
    const prevTouch1 = prevTouches[1];
    const calcMid = (a: Point, b: Point) => ({
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    });
    const mid = calcMid(touch0, touch1);
    const prevMid = calcMid(prevTouch0, prevTouch1);

    const dist = (a: Point, b: Point) =>
      Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    const hypot = dist(touch0, touch1);
    const prevHypot = dist(prevTouch0, prevTouch1);

    const scale = getScale();
    let zoomAmount = hypot / prevHypot;
    const newScale = scale * zoomAmount;
    if (newScale < getMaxScale() || newScale > getMinScale()) {
      return;
    }
    setScale(newScale);
    if (updateUIScale) updateUIScale(newScale);

    const scaleAmount = 1 - zoomAmount;

    const pan = {
      x: mid.x - prevMid.x,
      y: mid.y - prevMid.y,
    };

    const offset = getOffset();
    offset.x += pan.x / scale;
    offset.y += pan.y / scale;

    if (!this.canvas) return;
    const size = trueSize({
      width: this.canvas.clientWidth,
      height: this.canvas.clientHeight,
    });
    if (!size) return;

    const zoomRatio = {
      x: mid.x / size.width,
      y: mid.y / size.height,
    };

    const unitsZoomed = {
      x: size.width * scaleAmount,
      y: size.height * scaleAmount,
    };

    const unitsAdd = {
      left: unitsZoomed.x * zoomRatio.x,
      top: unitsZoomed.y * zoomRatio.y,
    };

    offset.x += unitsAdd.left;
    offset.y += unitsAdd.top;

    prevTouches[0] = touch0;
    prevTouches[1] = touch1;

    // redraw();
  }
}

export default MoveTool;
