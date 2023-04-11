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

export default Line;
