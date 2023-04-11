import React, {
  RefObject,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
  redo,
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
  undo,
  zoomBy,
} from "./shared/shared";
import Tool from "./tools/Tool";
import MoveTool from "./tools/MoveTool";
import Vector2 from "types/Vector2";

interface PaintProps {
  updateScale: (scale: number) => void;
}

let drawTool: Tool = new Brush();
let moveTool: Tool = new MoveTool();

function Paint({ updateScale }: PaintProps) {
  const [canvasRef, ctxRef] = useCanvas();

  function onWindowResize() {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  function keyboardHandler(e: KeyboardEvent) {
    const ctrl = e.ctrlKey;
    const shift = e.shiftKey;
    const key = e.key.toLocaleLowerCase();
    if (ctrl && !shift && key == "z") {
      undo();
      redraw();
    }

    if (ctrl && shift && key == "z") {
      redo();
      redraw();
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    drawTool.setCanvas(canvasRef.current);
    moveTool.setCanvas(canvasRef.current);
    document.addEventListener("keydown", keyboardHandler);
    onWindowResize();
    return () => {
      document.removeEventListener("keydown", keyboardHandler);
    };
  }, []);

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
      drawing.draw(ctx, (a: Vector2) => toScaled(a));
    });
    const offset = getOffset();
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
    };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    e.preventDefault();
    // левая кнопка
    if (e.button == 0) {
      drawTool.onMouseStart(e);
      setIsDrawing(true);
      setIsMoving(false);
    }

    // правая кнопка
    if (e.button == 2) {
      moveTool.onMouseStart(e);
      setIsDrawing(false);
      setIsMoving(true);
    }

    setCursor(new Vector2(e.pageX, e.pageY));
    setPrevCursor(new Vector2(e.pageX, e.pageY));
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    setCursor(new Vector2(e.pageX, e.pageY));

    const isDrawing = getIsDrawing();
    if (isDrawing) {
      drawTool.onMouseMove(e);
    }

    const isMoving = getIsMoving();
    if (isMoving) {
      moveTool.onMouseMove(e);
      redraw();
    }

    setPrevCursor(getCursor());
  }
  function onMouseUp() {
    if (getIsDrawing()) {
      drawTool.onMouseEnd();
    }
    if (getIsMoving()) {
      moveTool.onMouseEnd();
    }
    setIsDrawing(false);
    setIsMoving(false);
  }

  function onMouseWheel(e: React.WheelEvent<HTMLElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { deltaY } = e;
    const scaleAmount = -deltaY / 500;
    zoomBy(canvas, scaleAmount, new Vector2(e.pageX, e.pageY), updateScale);
    redraw();
  }

  function onTouchStart(e: React.TouchEvent<HTMLCanvasElement>) {
    const touches = e.touches;
    const prevTouches = getPrevTouches();
    if (touches.length == 1) {
      setSingleTouch(true);
      setDoubleTouch(false);
      prevTouches[0] = new Vector2(touches[0].pageX, touches[0].pageY);
    }
    if (touches.length == 2) {
      setSingleTouch(false);
      setDoubleTouch(true);
      moveTool.onTouchStart(e);
      prevTouches[0] = new Vector2(touches[0].pageX, touches[0].pageY);
      prevTouches[1] = new Vector2(touches[1].pageX, touches[1].pageY);
    }
    if (touches.length > 2) {
      setSingleTouch(false);
      setDoubleTouch(false);
    }
  }

  function updateUIScale() {
    updateScale(getScale());
  }

  function onTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    if (e.touches.length == 0) return;

    const singleTouch = getSingleTouch();
    if (singleTouch) {
      drawTool.onTouchMove(e);
      return;
    }

    const doubleTouch = getDoubleTouch();
    if (doubleTouch) {
      if (e.touches.length < 2) return;
      moveTool.onTouchMove(e, updateUIScale);
      redraw();
    }
  }

  function onTouchEnd(e: React.TouchEvent<HTMLElement>) {
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

export default memo(Paint);
