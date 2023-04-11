import Vector2 from "types/Vector2";

class Line {
  start: Vector2;
  end: Vector2;
  constructor(st: Vector2, end: Vector2) {
    this.start = st;
    this.end = end;
  }

  draw(ctx: CanvasRenderingContext2D, scale: (p: Vector2) => Vector2) {
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

export default Line;
