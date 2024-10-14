import React from "react";
import SwapsManagement from "./swaps/SwapsManagement";
import TokensPriceCharts from "./charts/TokensPriceCharts";

var classnames = require("classnames");

export default function Content({ token1, token2, setPopUp }) {
  return (
    <div
      className={classnames(
        "flexRow",
        "justify-content-between",
        "align-items-start",
        "content",
        "custom-scrollbar"
      )}
    >
      <SwapsManagement token1={token1} token2={token2} setPopUp={setPopUp} />
      <TokensPriceCharts token1={token1} token2={token2} />
      <div className="d-flex" style={{ width: 10 }} />
    </div>
  );
}
