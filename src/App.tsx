import { useEffect } from "react";
import Canvas from "./canvas";

function App() {
  let canvas: Canvas;

  useEffect(() => {
    canvas = new Canvas();
  }, []);

  return (
    <div className="App">
      <div id="hud">ABOBA</div>
      <canvas
        onMouseDown={(e) => canvas.onMouseDown(e)}
        onMouseUp={(e) => canvas.onMouseUp()}
        onMouseOut={(e) => canvas.onMouseUp()}
        onMouseMove={(e) => canvas.onMouseMove(e)}
        onWheel={(e) => canvas.onMouseWheel(e)}
        id="canvas"
      >
        Your browser doesn't support HTML5 Canvas
      </canvas>
    </div>
  );
}

export default App;
