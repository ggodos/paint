import React, { RefObject, useEffect, useRef } from "react";
import useCanvas from "../hooks/useCanvas";
import Brush from "./tools/brush";
import {
  addDrawing,
  getCursor,
  getDoubleTouch,
  getDrawings,
  getIsDrawing,
  getIsMoving,
  getMaxScale,
  getMinScale,
  getOffset,
  getPrevCursor,
  getPrevTouches,
  getScale,
  getSingleTouch,
  setCursor,
  setDoubleTouch,
  setIsDrawing,
  setIsMoving,
  setPrevCursor,
  setScale,
  setSingleTouch,
  toScaled,
  toTrue,
  trueSize,
} from "./shared/shared";
import Line from "../types/Drawings/Line";

interface PaintProps {
  updateScale: (scale: number) => void;
}

let mainTool: Tool = new Brush();
let secondTool: Tool | null = null;

function Paint({ updateScale }: PaintProps) {
  const [canvasRef, ctxRef] = useCanvas();
  mainTool.setCanvas(canvasRef.current);

  function onWindowResize() {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    onWindowResize();
  }, []);

  function setPaintScale(newScale: number) {
    setScale(newScale);
    updateScale(getScale());
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
    // нарисовать все фигуры
    const drawings = getDrawings();
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

  function onMouseDown(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    // левая кнопка
    if (e.button == 0) {
      setIsDrawing(true);
      setIsMoving(false);
    }

    // правая кнопка
    if (e.button == 2) {
      setIsDrawing(false);
      setIsMoving(true);
    }

    setCursor({
      x: e.pageX,
      y: e.pageY,
    });

    setPrevCursor({
      x: e.pageX,
      y: e.pageY,
    });
  }

  function onMouseMove(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

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
      line.draw(ctx, (a: Point) => toScaled(a));
    }

    const isMoving = getIsMoving();
    if (isMoving) {
      const offset = getOffset();
      offset.x += trueCursor.x - truePrevCursor.x;
      offset.y += trueCursor.y - truePrevCursor.y;
      redraw();
    }

    setPrevCursor(getCursor());
  }
  function onMouseUp() {
    setIsDrawing(false);
    setIsMoving(false);
  }

  function onMouseWheel(e: React.WheelEvent<HTMLElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { deltaY } = e;
    const scaleAmount = -deltaY / 500;
    const newScale = getScale() * (1 + scaleAmount);
    if (newScale < getMaxScale() || newScale > getMinScale()) {
      return;
    }
    const truePrevCursor = toTrue(getPrevCursor());
    setPaintScale(newScale);
    var distX = e.pageX / canvas.clientWidth;
    var distY = e.pageY / canvas.clientHeight;

    const size = trueSize({
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    });
    if (!size) return;

    const unitsZoomedX = size.width * scaleAmount;
    const unitsZoomedY = size.height * scaleAmount;

    const unitsAddLeft = unitsZoomedX * distX;
    const unitsAddTop = unitsZoomedY * distY;

    const offset = getOffset();
    offset.x -= unitsAddLeft;
    offset.y -= unitsAddTop;

    setPrevCursor(toScaled(truePrevCursor));
    redraw();
  }

  function onTouchStart(e: React.TouchEvent<HTMLElement>) {
    e.preventDefault();
    console.log("touch start");
    const touches = e.touches;
    const prevTouches = getPrevTouches();
    if (touches.length == 1) {
      setSingleTouch(true);
      setDoubleTouch(false);
      prevTouches[0] = { x: touches[0].pageX, y: touches[0].pageY };
    }
    if (touches.length == 2) {
      setSingleTouch(false);
      setDoubleTouch(true);
      prevTouches[0] = { x: touches[0].pageX, y: touches[0].pageY };
      prevTouches[1] = { x: touches[1].pageX, y: touches[1].pageY };
    }
    if (touches.length > 2) {
      setSingleTouch(false);
      setDoubleTouch(false);
    }
  }

  function onTouchMove(e: React.TouchEvent<HTMLElement>) {
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
      const ctx = ctxRef.current;
      if (!ctx) return;
      line.draw(ctx, (a: Point) => toScaled(a));
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
      setPaintScale(newScale);

      const scaleAmount = 1 - zoomAmount;

      const pan = {
        x: mid.x - prevMid.x,
        y: mid.y - prevMid.y,
      };

      const offset = getOffset();
      offset.x += pan.x / scale;
      offset.y += pan.y / scale;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const size = trueSize({
        width: canvas.clientWidth,
        height: canvas.clientHeight,
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

      redraw();
    }
  }

  function onTouchEnd(e: React.TouchEvent<HTMLElement>) {
    e.preventDefault();
    setSingleTouch(false);
    setDoubleTouch(false);
  }

  document.oncontextmenu = () => false;

  redraw();
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={(e) => onMouseDown(e)}
      onMouseUp={() => onMouseUp()}
      onMouseOut={() => onMouseUp()}
      onMouseMove={(e) => onMouseMove(e)}
      onWheel={(e) => onMouseWheel(e)}
      onTouchStart={(e) => onTouchStart(e)}
      onTouchMove={(e) => onTouchMove(e)}
      onTouchEnd={(e) => onTouchEnd(e)}
      onTouchCancel={(e) => onTouchEnd(e)}
    >
      Your browser is the best browser, be proud of it.
    </canvas>
  );
}

export default Paint;
