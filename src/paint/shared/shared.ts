import { Figure } from "types/Drawings/Figure";
import Vector2 from "types/Vector2";

let _drawings: Array<Figure> = [];
let redoDrawings: Array<Figure> = [];
let _cursor: Vector2 = Vector2.zero();
let _prevCursor: Vector2 = Vector2.zero();
let _prevTrueMid: Vector2 | null = null;
let _offset: Vector2 = Vector2.zero();
let _scale: number = 1;
const maxScale = 1e-15;
const minScale = 1e20;

let _isDrawing: boolean = false;
let _isMoving: boolean = false;

let _singleTouch: boolean = false;
let _doubleTouch: boolean = false;

const _prevTouches: Array<Vector2> = [Vector2.zero(), Vector2.zero()];

// getters and setter for every variable
export const getDrawings = (): Array<Figure> => _drawings;
export const setDrawings = (newDrawings: Array<Figure>): void => {
  _drawings = newDrawings;
};
// add a drawing to the array
export const addDrawing = (drawing: Figure): void => {
  _drawings.push(drawing);
  redoDrawings = [];
};

export const getCursor = (): Vector2 => _cursor;
export const setCursor = (newCursor: Vector2): void => {
  _cursor = newCursor;
};
export const getPrevCursor = (): Vector2 => _prevCursor;
export const setPrevCursor = (newPrevCursor: Vector2): void => {
  _prevCursor = newPrevCursor;
};
export const getPrevTrueMid = (): Vector2 | null => _prevTrueMid;
export const setPrevTrueMid = (newPrevTrueMid: Vector2 | null): void => {
  _prevTrueMid = newPrevTrueMid;
};
export const getOffset = (): Vector2 => _offset;
export const setOffset = (newOffset: Vector2): void => {
  _offset = newOffset;
};
export const getScale = (): number => _scale;
export const setScale = (newScale: number): void => {
  _scale = newScale;
};
export const getMaxScale = (): number => maxScale;
export const getMinScale = (): number => minScale;

// getters and setter for every boolean
export const getIsDrawing = (): boolean => _isDrawing;
export const setIsDrawing = (newIsDrawing: boolean): void => {
  _isDrawing = newIsDrawing;
};
export const getIsMoving = (): boolean => _isMoving;
export const setIsMoving = (newIsMoving: boolean): void => {
  _isMoving = newIsMoving;
};
export const getSingleTouch = (): boolean => _singleTouch;
export const setSingleTouch = (newSingleTouch: boolean): void => {
  _singleTouch = newSingleTouch;
};
export const getDoubleTouch = (): boolean => _doubleTouch;
export const setDoubleTouch = (newDoubleTouch: boolean): void => {
  _doubleTouch = newDoubleTouch;
};
export const getPrevTouches = (): Array<Vector2> => _prevTouches;
export const setPrevTouches = (newPrevTouches: Array<Vector2>): void => {
  _prevTouches[0] = newPrevTouches[0];
  _prevTouches[1] = newPrevTouches[1];
};
export function toScaled(p: Vector2): Vector2 {
  const offset = getOffset();
  const scale = getScale();
  return offset.add(p).multiply(scale);
}

export function toTrue(p: Vector2): Vector2 {
  const offset = getOffset();
  const scale = getScale();
  return p.divide(scale).sub(offset);
}

export function trueSize(size: Size): Size {
  const scale = getScale();
  return {
    height: size.height / scale,
    width: size.width / scale,
  };
}

export function zoomBy(
  canvas: HTMLCanvasElement,
  scaleAmount: number,
  p: Vector2,
  updateUIScale?: (newScale: number) => void
): void {
  const newScale = getScale() * (1 + scaleAmount);
  if (newScale < getMaxScale() || newScale > getMinScale()) {
    return;
  }

  setScale(newScale);
  if (updateUIScale) updateUIScale(newScale);
  const dist = new Vector2(p.x / canvas.clientWidth, p.y / canvas.clientHeight);
  const size = trueSize({
    width: canvas.clientWidth,
    height: canvas.clientHeight,
  });

  const unitsZoomed = new Vector2(
    size.width * scaleAmount,
    size.height * scaleAmount
  );

  const unitsSub = new Vector2(unitsZoomed.x * dist.x, unitsZoomed.y * dist.y);

  const offset = getOffset();
  offset.selfSub(unitsSub);
}

export function undo() {
  const drawings = getDrawings();
  if (drawings.length > 0) {
    redoDrawings.push(drawings.pop() as Figure);
  }
}

export function redo() {
  if (redoDrawings.length > 0) {
    _drawings.push(redoDrawings.pop() as Figure);
  }
}
