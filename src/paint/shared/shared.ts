import { Drawing } from "../../types/Drawings/Drawing";
import { Point } from "../../types/Point";
import { Size } from "../../types/Size";

let _drawings: Array<Drawing> = [];
let _cursor: Point = { x: 0, y: 0 };
let _prevCursor: Point = { x: 0, y: 0 };
let _offset: Point = { x: 0, y: 0 };
let _scale: number = 1;
const maxScale = 1e-15;
const minScale = 1e20;

let _isDrawing: boolean = false;
let _isMoving: boolean = false;

let _singleTouch: boolean = false;
let _doubleTouch: boolean = false;

const _prevTouches: Array<Point> = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

// getters and setter for every variable
export const getDrawings = (): Array<Drawing> => _drawings;
export const setDrawings = (newDrawings: Array<Drawing>): void => {
  _drawings = newDrawings;
};
// add a drawing to the array
export const addDrawing = (drawing: Drawing): void => {
  _drawings.push(drawing);
};

export const getCursor = (): Point => _cursor;
export const setCursor = (newCursor: Point): void => {
  _cursor = newCursor;
};
export const getPrevCursor = (): Point => _prevCursor;
export const setPrevCursor = (newPrevCursor: Point): void => {
  _prevCursor = newPrevCursor;
};
export const getOffset = (): Point => _offset;
export const setOffset = (newOffset: Point): void => {
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
export const getPrevTouches = (): Array<Point> => _prevTouches;
export const setPrevTouches = (newPrevTouches: Array<Point>): void => {
  _prevTouches[0] = newPrevTouches[0];
  _prevTouches[1] = newPrevTouches[1];
};
export function toScaled(p: Point): Point {
  const offset = getOffset();
  const scale = getScale();
  return {
    x: (p.x + offset.x) * scale,
    y: (p.y + offset.y) * scale,
  };
}

export function toTrue(p: Point): Point {
  const offset = getOffset();
  const scale = getScale();
  return {
    x: p.x / scale - offset.x,
    y: p.y / scale - offset.y,
  };
}

export function trueSize(size: Size): Size {
  const scale = getScale();
  return {
    height: size.height / scale,
    width: size.width / scale,
  };
}
