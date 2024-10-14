import React from "react";
import ChartContainer from "./ChartContainer";

var classnames = require("classnames");

export default function TokensPriceCharts({ token1, token2 }) {
  return (
    <div
      className={classnames(
        "flexColumn",
        "center",
        "flex-fill",
        "selectedTokensCharts"
      )}
    >
      <ChartContainer token={token1} />
      <div style={{ height: 10 }} />
      <ChartContainer token={token2} />
    </div>
  );
}
