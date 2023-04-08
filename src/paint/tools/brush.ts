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

class Brush implements Tool {
  name: string = "Brush";
  description: string = "Draw with a brush";
  icon: string = "brush";
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  setCanvas(canvas: HTMLCanvasElement | null): void {
    this.canvas = canvas;
    this.ctx = canvas?.getContext("2d") || null;
  }
  onmousemove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
    if (!this.canvas || !this.ctx) return;

    setCursor({
      x: e.pageX,
      y: e.pageY,
    });

    const trueCursor = toTrue(getCursor());
    const truePrevCursor = toTrue(getPrevCursor());
    const isDrawing = getIsDrawing();
    if (isDrawing) {
      const line = new Line(truePrevCursor, trueCursor);
      addDrawing(line);
      line.draw(this.ctx, (a: Point) => toScaled(a));
    }

    const isMoving = getIsMoving();
    if (isMoving) {
      const offset = getOffset();
      offset.x += trueCursor.x - truePrevCursor.x;
      offset.y += trueCursor.y - truePrevCursor.y;
      // redraw();
    }

    setPrevCursor(getCursor());
  }
  ontouchmove(e: React.TouchEvent<HTMLCanvasElement>): void {
    e.preventDefault();
    if (e.touches.length == 0) return;
    const prevTouches = getPrevTouches();
    const touch0 = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    };
    const prevTouch0 = prevTouches[0];

    const singleTouch = getSingleTouch();
    if (singleTouch) {
      const trueTouch0 = toTrue(touch0);
      const truePrevTouch0 = toTrue(prevTouch0);
      const line = new Line(truePrevTouch0, trueTouch0);
      addDrawing(line);
      if (!this.ctx) return;
      line.draw(this.ctx, (a: Point) => toScaled(a));
      prevTouches[0] = touch0;
      return;
    }

    const doubleTouch = getDoubleTouch();
    if (doubleTouch) {
      if (e.touches.length < 2) return;
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
      // setPaintScale(newScale);

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
}

export default Brush;
