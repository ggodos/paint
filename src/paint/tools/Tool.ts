class Tool {
  name: string = "Tool";
  description: string = "Tool description";
  icon: string = "tool";
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  setCanvas(canvas: HTMLCanvasElement | null): void {
    this.canvas = canvas;
    this.ctx = canvas?.getContext("2d") || null;
  }
  onStart(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {}
  onEnd(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {}
  onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {}
  onTouchMove(
    e: React.TouchEvent<HTMLCanvasElement>,
    updateUIScale?: (newScale: number) => void
  ): void {}
}

export default Tool;
