import IconButton from "../ui/IconButton";
import React from "react";
import { useState, useEffect } from "react";
import Trades from "./Trades";
import TradeTokensCharts from "./TradeTokensCharts";

var classnames = require("classnames");

export default function Content({ token1, token2, settings, setSettings }) {
  return (
    <div
      className={classnames(
        "d-flex",
        "flex-row",
        "justify-content-between",
        "align-items-start",
        "content",
        "custom-scrollbar"
      )}
    >
      <Trades
        token1={token1}
        token2={token2}
        settings={settings}
        setSettings={setSettings}
      ></Trades>
      <TradeTokensCharts token1={token1} token2={token2}></TradeTokensCharts>
      <div className="d-flex" style={{ width: 10 }}></div>
    </div>
  );
}
