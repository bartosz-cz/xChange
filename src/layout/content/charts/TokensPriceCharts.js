import React from "react";
import ChartContainer from "./ChartContainer";

var classnames = require("classnames");

export default function TokensPriceCharts({ token1, token2 }) {
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
    >
      <ChartContainer token={token1} />
      <div style={{ height: 10 }}></div>
      <ChartContainer token={token2} />
    </div>
  );
}
