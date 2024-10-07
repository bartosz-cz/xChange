var classnames = require("classnames");

export default function Swap({ token1, token2 }) {
  return (
    <div
      className={classnames(
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-items-center",
        "flex-fill",
        "tradeTokensCharts"
      )}
    ></div>
  );
}
