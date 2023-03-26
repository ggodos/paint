interface UIProps {
  scale: number;
}

function UI({ scale }: UIProps) {
  const format = {
    scale: scale.toFixed(10),
  };

  return (
    <div id="ui">
      <div id="ui-displayed">scale: {format.scale}</div>
    </div>
  );
}

export default UI;
