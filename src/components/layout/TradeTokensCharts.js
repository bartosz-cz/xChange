import IconButton from "../ui/IconButton";
import React from "react";
import { useState } from "react";
import ChartContainer from "./ChartContainer";

var classnames = require("classnames");

export default function TradeTokensCharts({ token1, token2 }) {
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
      <ChartContainer token={token1}></ChartContainer>
      <div style={{ height: 10 }}></div>
      <ChartContainer token={token2}></ChartContainer>
    </div>
  );
}
