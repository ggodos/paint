import { useState } from "react";
import Paint from "./paint/Paint";
import UI from "./UI";
import { getScale } from "./paint/shared/shared";

function App() {
  let [uiScale, setUIScale] = useState(getScale());

  function updateScale(newScale: number) {
    setUIScale(newScale);
  }

  return (
    <div className="App">
      <UI scale={uiScale} />
      <Paint updateScale={updateScale} />
    </div>
  );
}

export default App;
