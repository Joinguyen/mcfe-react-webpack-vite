import "./index.scss";

function SkeletonBox({
  numOfLines = 5,
  minWidth = 10,
  maxWidth = 20,
  height = 1,
  margin = "2px 0",
}) {
  const Arr = [];

  function randomWidth() {
    return Math.floor(Math.random() * (maxWidth - minWidth)) + minWidth;
  }

  for (let i = 0; i < numOfLines; i++) {
    Arr.push(
      <div
        key={Math.random()}
        className="skeleton-box"
        style={{
          margin: margin,
          height: height + "rem",
          width: randomWidth() + "rem",
        }}
      ></div>
    );
  }

  return <>{Arr}</>;
}

export default SkeletonBox;
