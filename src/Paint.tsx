import React, { RefObject, useEffect, useRef } from "react";
import useCanvas from "./hooks/useCanvas";

interface Size {
  height: number;
  width: number;
}

interface Point {
  x: number;
  y: number;
}

interface Drawing {
  draw: (ctx: CanvasRenderingContext2D, scale: (p: Point) => Point) => void;
}
class Line {
  start: Point;
  end: Point;
  constructor(st: Point, end: Point) {
    this.start = st;
    this.end = end;
  }

  draw(ctx: CanvasRenderingContext2D, scale: (p: Point) => Point) {
    const st = scale(this.start);
    const ed = scale(this.end);
    ctx.beginPath();
    ctx.moveTo(st.x, st.y);
    ctx.lineTo(ed.x, ed.y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

interface PaintProps {
  updateScale: (scale: number) => void;
  width: number;
  height: number;
}

let drawings: Array<Drawing> = [];
let cursor: Point = { x: 0, y: 0 };
let prevCursor: Point = { x: 0, y: 0 };
let offset: Point = { x: 0, y: 0 };
let scale: number = 1;
const maxScale = 1e-50;
const minScale = 1e50;

function Paint({ updateScale, width, height }: PaintProps) {
  const [canvasRef, ctxRef] = useCanvas();

  let isDrawing: boolean = false;
  let isMoving: boolean = false;

  function onWindowResize() {
    const canvas = canvasRef.current;
    if (canvas) {
      // canvas.width = document.body.clientWidth;
      // canvas.height = document.body.clientHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    onWindowResize();
  }, []);

  function setScale(newScale: number) {
    scale = newScale;
    updateScale(scale);
  }

  function toScaled(p: Point): Point {
    return {
      x: (p.x + offset.x) * scale,
      y: (p.y + offset.y) * scale,
    };
  }

  function toTrue(p: Point): Point {
    return {
      x: p.x / scale - offset.x,
      y: p.y / scale - offset.y,
    };
  }

  function trueSize(): Size | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return {
      height: canvas.clientHeight / scale,
      width: canvas.clientWidth / scale,
    };
  }

  function redraw() {
    // canvas под размер окна
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    // очистить
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log(drawings);
    // нарисовать все фигуры
    drawings.forEach((drawing) => {
      drawing.draw(ctx, (a: Point) => toScaled(a));
    });
  }

  function saveImage() {
    // Create an image element and set its src attribute to the image URL
    const img = new Image();
    img.src = "path/to/image.png";

    // When the image has loaded, draw it onto the canvas and cache it
    img.onload = function () {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      ctx.drawImage(img, 0, 0);
      const cachedImage = canvas.toDataURL();
      // console.log(cachedImage);
    };
  }

  function onMouseDown(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    // левая кнопка
    if (e.button == 0) {
      isDrawing = true;
      isMoving = false;
    }

    // правая кнопка
    if (e.button == 2) {
      isDrawing = false;
      isMoving = true;
    }

    cursor = { x: e.pageX, y: e.pageY };
    prevCursor = { x: e.pageX, y: e.pageY };
  }
  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    cursor = { x: e.pageX, y: e.pageY };
    const scaled = toTrue(cursor);
    const prevScaled = toTrue(prevCursor);

    if (isDrawing) {
      const line = new Line(prevScaled, scaled);
      drawings.push(line);
      line.draw(ctx, (a: Point) => toScaled(a));
    }

    if (isMoving) {
      offset.x += (cursor.x - prevCursor.x) / scale;
      offset.y += (cursor.y - prevCursor.y) / scale;
      redraw();
    }

    prevCursor = cursor;
  }
  function onMouseUp() {
    isDrawing = false;
    isMoving = false;
  }
  function onMouseWheel(e: React.WheelEvent<HTMLElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { deltaY } = e;
    const scaleAmount = -deltaY / 500;
    const newScale = scale * (1 + scaleAmount);
    if (newScale < maxScale || newScale > minScale) {
      return;
    }
    setScale(newScale);
    // zoom the page based on where the cursor is
    var distX = e.pageX / canvas.clientWidth;
    var distY = e.pageY / canvas.clientHeight;

    // calculate how much we need to zoom
    const size = trueSize();
    if (!size) return;

    const unitsZoomedX = size.width * scaleAmount;
    const unitsZoomedY = size.height * scaleAmount;

    const unitsAddLeft = unitsZoomedX * distX;
    const unitsAddTop = unitsZoomedY * distY;

    offset.x -= unitsAddLeft;
    offset.y -= unitsAddTop;

    redraw();
  }

  document.oncontextmenu = () => false;

  cursor = { x: 0, y: 0 };
  prevCursor = { x: 0, y: 0 };
  redraw();
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={(e) => onMouseDown(e)}
      onMouseUp={(e) => onMouseUp()}
      onMouseOut={(e) => onMouseUp()}
      onMouseMove={(e) => onMouseMove(e)}
      onWheel={(e) => onMouseWheel(e)}
    >
      Your browser is the best browser, be proud of it.
    </canvas>
  );
}

export default Paint;
