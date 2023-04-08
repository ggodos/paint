import { useState } from "react";
import Paint from "./paint/Paint";
import UI from "./UI";

function App() {
  let [scale, setScale] = useState(1);

  function changeScale(scale: number) {
    setScale(scale);
  }
  return (
    <div className="App">
      <UI scale={scale} />
      <Paint updateScale={changeScale} />
    </div>
  );
}

export default App;
