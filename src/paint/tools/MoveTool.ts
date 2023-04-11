import Vector2 from "types/Vector2";
import {
  getCursor,
  getOffset,
  getPrevCursor,
  getPrevTouches,
  getScale,
  setPrevTouches,
  toTrue,
  zoomBy,
} from "../shared/shared";
import Tool from "./Tool";

class MoveTool extends Tool {
  name: string = "Move";
  description: string = "Move the canvas";
  icon: string = "move";
  startMid: Vector2 | null = null;
  onTouchStart(e: React.TouchEvent<HTMLCanvasElement>): void {
    if (e.touches.length < 2 || !this.canvas || !this.ctx) return;

    this.startMid = new Vector2(
      (e.touches[0].pageX + e.touches[1].pageX) / 2,
      (e.touches[0].pageY + e.touches[1].pageY) / 2
    );
  }

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
    if (e.touches.length < 2 || !this.canvas || !this.ctx) return;
    const prevTouches = getPrevTouches();
    const t1 = new Vector2(e.touches[0].pageX, e.touches[0].pageY);
    const t2 = new Vector2(e.touches[1].pageX, e.touches[1].pageY);
    const prevT1 = new Vector2(prevTouches[0].x, prevTouches[0].y);
    const prevT2 = new Vector2(prevTouches[1].x, prevTouches[1].y);

    // zoom
    const calcDist = (t1: Vector2, t2: Vector2) =>
      Math.sqrt(Math.pow(t1.x - t2.x, 2) + Math.pow(t1.y - t2.y, 2));
    const prevDist = calcDist(prevT1, prevT2);
    const curDist = calcDist(t1, t2);
    // const scale = getScale();
    var zoom = curDist / prevDist;
    const scaleAmount = zoom - 1;
    const calcMid = (t1: Vector2, t2: Vector2) => t1.add(t2).divide(2);
    const prevMid = calcMid(prevT1, prevT2);
    const curMid = calcMid(t1, t2);
    if (this.startMid) {
      zoomBy(this.canvas, scaleAmount, this.startMid, updateUIScale);
    }
    // getOffset().selfSub(prevMid.sub(curMid));
    setPrevTouches([t1, t2]);
  }
}

export default MoveTool;
