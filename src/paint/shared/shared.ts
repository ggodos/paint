let drawings: Array<Drawing> = [];
let cursor: Point = { x: 0, y: 0 };
let prevCursor: Point = { x: 0, y: 0 };
let offset: Point = { x: 0, y: 0 };
let scale: number = 1;
const maxScale = 1e-15;
const minScale = 1e20;

let isDrawing: boolean = false;
let isMoving: boolean = false;

let singleTouch: boolean = false;
let doubleTouch: boolean = false;

// getters and setter for every variable
export const getDrawings = (): Array<Drawing> => drawings;
export const setDrawings = (newDrawings: Array<Drawing>): void => {
  drawings = newDrawings;
};
// add a drawing to the array
export const addDrawing = (drawing: Drawing): void => {
  drawings.push(drawing);
};

export const getCursor = (): Point => cursor;
export const setCursor = (newCursor: Point): void => {
  cursor = newCursor;
};
export const getPrevCursor = (): Point => prevCursor;
export const setPrevCursor = (newPrevCursor: Point): void => {
  prevCursor = newPrevCursor;
};
export const getOffset = (): Point => offset;
export const setOffset = (newOffset: Point): void => {
  offset = newOffset;
};
export const getScale = (): number => scale;
export const setScale = (newScale: number): void => {
  scale = newScale;
};
export const getMaxScale = (): number => maxScale;
export const getMinScale = (): number => minScale;

// getters and setter for every boolean
export const getIsDrawing = (): boolean => isDrawing;
export const setIsDrawing = (newIsDrawing: boolean): void => {
  isDrawing = newIsDrawing;
};
export const getIsMoving = (): boolean => isMoving;
export const setIsMoving = (newIsMoving: boolean): void => {
  isMoving = newIsMoving;
};
export const getSingleTouch = (): boolean => singleTouch;
export const setSingleTouch = (newSingleTouch: boolean): void => {
  singleTouch = newSingleTouch;
};
export const getDoubleTouch = (): boolean => doubleTouch;
export const setDoubleTouch = (newDoubleTouch: boolean): void => {
  doubleTouch = newDoubleTouch;
};
