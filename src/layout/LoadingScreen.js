function LoadingScreen({ progress, text }) {
  return (
    <div className={"flexColumn center fillSpace progressContainer"}>
      <progress className="progress" value={progress} />
      {text}
    </div>
  );
}

export default LoadingScreen;
