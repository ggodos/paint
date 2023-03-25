interface Size {
  height: number;
  width: number;
}

interface Point {
  x: number;
  y: number;
}

interface Drawing {
  draw: (context: CanvasRenderingContext2D, scale: (p: Point) => Point) => void;
}

class Line {
  start: Point;
  end: Point;
  constructor(st: Point, end: Point) {
    this.start = st;
    this.end = end;
  }

  draw(context: CanvasRenderingContext2D, scale: (p: Point) => Point) {
    const st = scale(this.start);
    const ed = scale(this.end);
    context.beginPath();
    context.moveTo(st.x, st.y);
    context.lineTo(ed.x, ed.y);
    context.strokeStyle = "#000";
    context.lineWidth = 2;
    context.stroke();
  }
}

export default class Canvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  drawings: Array<Drawing> = [];
  cursor: Point = { x: 0, y: 0 };
  prevCursor: Point = { x: 0, y: 0 };
  offset: Point = { x: 0, y: 0 };
  scale: number = 1;

  isDrawing: boolean = false;
  isMoving: boolean = false;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!this.canvas) throw Error("can't found canvas element");
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!this.canvas) throw Error("can't found drawing context");

    document.oncontextmenu = () => false;

    this.cursor = { x: 0, y: 0 };
    this.prevCursor = { x: 0, y: 0 };
    this.render();
  }

  toScaled(p: Point): Point {
    return {
      x: (p.x + this.offset.x) * this.scale,
      y: (p.y + this.offset.y) * this.scale,
    };
  }

  toTrue(p: Point): Point {
    return {
      x: p.x / this.scale - this.offset.x,
      y: p.y / this.scale - this.offset.y,
    };
  }

  trueSize(): Size {
    return {
      height: this.canvas?.clientHeight / this.scale,
      width: this.canvas?.clientWidth / this.scale,
    };
  }

  render() {
    // canvas под размер окна
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = window.innerHeight - 4;

    // очистить
    this.context.fillStyle = "#fff";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height - 1);

    // нарисовать все фигуры
    this.drawings.forEach((drawing) => {
      drawing.draw(this.context, (a: Point) => this.toScaled(a));
    });
  }

  onMouseDown(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    // левая кнопка
    if (e.button == 0) {
      this.isDrawing = true;
      this.isMoving = false;
    }

    // правая кнопка
    if (e.button == 2) {
      this.isDrawing = false;
      this.isMoving = true;
    }

    this.cursor = { x: e.pageX, y: e.pageY };
    this.prevCursor = { x: e.pageX, y: e.pageY };
  }
  onMouseMove(e: React.MouseEvent<HTMLElement>) {
    this.cursor = { x: e.pageX, y: e.pageY };
    const scaled = this.toTrue(this.cursor);
    const prevScaled = this.toTrue(this.prevCursor);

    if (this.isDrawing) {
      const line = new Line(prevScaled, scaled);
      this.drawings.push(line);
      line.draw(this.context, (a: Point) => this.toScaled(a));
    }
    if (this.isMoving) {
      console.log(this.cursor, this.prevCursor, this.scale);
      this.offset.x += (this.cursor.x - this.prevCursor.x) / this.scale;
      this.offset.y += (this.cursor.y - this.prevCursor.y) / this.scale;
      this.render();
    }
    this.prevCursor = this.cursor;
  }
  onMouseUp() {
    this.isDrawing = false;
    this.isMoving = false;
  }
  onMouseWheel(e: React.WheelEvent<HTMLElement>) {
    const { deltaY } = e;
    const scaleAmount = -deltaY / 500;
    this.scale = this.scale * (1 + scaleAmount);

    // zoom the page based on where the cursor is
    var distX = e.pageX / this.canvas.clientWidth;
    var distY = e.pageY / this.canvas.clientHeight;

    // calculate how much we need to zoom

    const size = this.trueSize();
    const unitsZoomedX = size.width * scaleAmount;
    const unitsZoomedY = size.height * scaleAmount;

    const unitsAddLeft = unitsZoomedX * distX;
    const unitsAddTop = unitsZoomedY * distY;

    this.offset.x -= unitsAddLeft;
    this.offset.y -= unitsAddTop;

    this.render();
  }
}
