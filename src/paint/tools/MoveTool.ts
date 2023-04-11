import Vector2 from "types/Vector2";
import {
  getCursor,
  getMaxScale,
  getMinScale,
  getOffset,
  getPrevCursor,
  getPrevTouches,
  getPrevTrueMid,
  getScale,
  setPrevTouches,
  setPrevTrueMid,
  setScale,
  toScaled,
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
    e.preventDefault();
    if (e.touches.length < 2 || !this.canvas || !this.ctx) return;
    const prevTouches = getPrevTouches();
    const t1 = new Vector2(e.touches[0].pageX, e.touches[0].pageY);
    const t2 = new Vector2(e.touches[1].pageX, e.touches[1].pageY);
    const prevT1 = new Vector2(prevTouches[0].x, prevTouches[0].y);
    const prevT2 = new Vector2(prevTouches[1].x, prevTouches[1].y);

    // var zoomScale = Math.sqrt(
    //   Math.pow(t1.x - t2.x, 2) + Math.pow(t1.y - t2.y, 2)
    // );
    const calcMid = (a: Vector2, b: Vector2) => a.add(b).div(2);

    // zoom
    const dist1 = Math.sqrt(
      Math.pow(prevT1.x - prevT2.x, 2) + Math.pow(prevT1.y - prevT2.y, 2)
    );
    const dist2 = Math.sqrt(
      Math.pow(t1.x - t2.x, 2) + Math.pow(t1.y - t2.y, 2)
    );
    const scale = getScale();
    const maxScale = getMaxScale();
    const minScale = getMinScale();
    var zoom = dist2 / dist1;
    var newScale = scale * zoom;
    setScale(newScale);
    if (updateUIScale) updateUIScale(newScale);

    // try
    const offset = getOffset();
    // get canvas size
    const canvasSize = trueSize(this.canvas);
    // get midVector2
    const canvasMid = calcMid(
      offset,
      new Vector2(canvasSize.width, canvasSize.height).add(offset)
    );

    const currentMid = calcMid(t1, t2);

    const prevTrueMid = getPrevTrueMid();
    if (prevTrueMid) {
      const prevMid = toScaled(prevTrueMid);
      offset.x -= prevMid.x - currentMid.x;
      offset.y -= prevMid.y - currentMid.y;
    }

    setPrevTrueMid(toTrue(currentMid));
    setPrevTouches([t1, t2]);
  }
}

export default MoveTool;
