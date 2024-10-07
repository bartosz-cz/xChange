import React from "react";
import { useState, useEffect } from "react";
import LineChart from "../../../components/shared/LineChart";
import useCrypto from "../../../hooks/useCrypto";
import ChartMenu from "./ChartMenu";
var classnames = require("classnames");

export default function ChartContainer({ token }) {
  const { isReady, cryptoPrices, getCryptoPrice, loadingRef } = useCrypto();
  const [color, setColor] = useState("#007e71");
  const [data, setData] = useState({ values: [0], timestamps: [0], change: 0 });
  const [rangeSelected, setRangeSelected] = useState([
    1,
    144,
    "histominute",
    10,
  ]);
  useEffect(() => {
    let timestamps = [];
    let values = [];
    let name = token.symbol.toUpperCase();

    if (
      cryptoPrices &&
      cryptoPrices.histominute[name] &&
      !loadingRef.current[name]
    ) {
      let newData = getCryptoPrice(
        name,
        rangeSelected[1],
        rangeSelected[2],
        rangeSelected[3]
      );
      //console.log("chart DaTA");
      //console.log(newData);
      if (newData) {
        timestamps = newData.map((item) => item[0]);
        if (rangeSelected[2] === "histominute") {
          timestamps = timestamps.map((timestamp) => {
            const date = new Date(timestamp);
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`; // Format as 'HH:mm'
          });
        } else {
          timestamps = timestamps.map((timestamp) => {
            const date = new Date(timestamp);
            const month = date.toLocaleString("default", { month: "short" });
            const day = date.getDate();
            return `${month} ${day}`; // Format as 'Mon DD'
          });
        }
        values = newData.map((item) => item[1]);
        //console.log(values);
        let change = "0";
        if (color === "#007e71") {
          change = (((values[values.length - 1] - values[0]) / values[0]) * 100)
            .toString()
            .slice(0, 3);
        } else {
          change = (((values[0] - values[values.length - 1]) / values[0]) * 100)
            .toString()
            .slice(0, 3);
        }
        if (change[change.length - 1] === ".") change = change.replace(".", "");
        change = change + "%";
        setData({ timestamps: timestamps, values: values, change: change });
        setColor(
          values[0] <= values[values.length - 1] ? "#007e71" : "#7e0000"
        );
      }
    }
  }, [
    cryptoPrices.histominute[token.symbol.toUpperCase()],
    cryptoPrices.histohour[token.symbol.toUpperCase()],
    cryptoPrices.histoday[token.symbol.toUpperCase()],
    token,
    rangeSelected,
  ]);
  return (
    <div
      className={classnames(
        "d-flex",
        "flex-row",
        "justify-content-center",
        "align-items-center",
        "chartContainer",
        "flex-fill",
        "customBorder"
      )}
    >
      <LineChart
        styleClass={"MainChart"}
        isReady={isReady}
        data={data.values}
        labels={data.timestamps}
        color={color}
      />
      <ChartMenu
        token={token}
        data={data.values}
        rangeSelected={rangeSelected}
        setRangeSelected={setRangeSelected}
      />
    </div>
  );
}
