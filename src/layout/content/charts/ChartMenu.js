import React from "react";

import Icons from "../../../components/shared/Icon";

var classnames = require("classnames");

export default function ChartMenu({
  token,
  data,
  rangeSelected,
  setRangeSelected,
}) {
  const Handler = (val) => {
    setRangeSelected(val);
  };
  let marketCap = Number(
    (token.total_supply.toFixed(0) * data[data.length - 1]).toFixed()
  );
  marketCap = "$" + marketCap.toLocaleString();
  return (
    <div
      className={classnames(
        "flexColumn",
        "justify-content-start",
        "align-items-center",
        "chartMenu"
      )}
    >
      <div
        className="flexRow center textLight unselectable "
        style={{ "--fontSize": 18 + `px`, marginTop: 10 }}
      >
        <img
          className={"d-flex"}
          src={token.image}
          alt="Icon"
          style={{ width: 20 }}
        />
        <div style={{ width: 10 }}></div>
        {token.symbol.toUpperCase()}
      </div>
      <div className="column">
        <div
          className="flexRow justify-content-start align-items-center textLight unselectable "
          style={{ "--fontSize": 18 + `px`, marginTop: 10 }}
        >
          <Icons name={"ArrowUp"} size={24} fill={"#007e71"} />
          <div style={{ width: 10 }}></div>
          {"$" + Math.max(...data)}
        </div>
        <div
          className="flexRow justify-content-start align-items-center textLight unselectable "
          style={{ "--fontSize": 18 + `px`, marginTop: 10, marginBottom: 10 }}
        >
          <Icons name={"ArrowDown"} size={24} fill={"#7e0000"} />
          <div style={{ width: 10 }} />
          {"$" + Math.min(...data)}
        </div>
      </div>

      <div
        className="flexColumn justify-content-start align-items-center textLight"
        style={{ "--fontSize": 15 + `px`, marginTop: 10 }}
      >
        <div className="d-flex unselectable">Market Cap</div>
        <div style={{ height: 5 }} />
        <div className="d-flex unselectable">{marketCap}</div>
      </div>
      <div
        className="flexColumn justify-content-start align-items-center textLight"
        style={{ "--fontSize": 15 + `px`, marginTop: 15 }}
      >
        <div className="d-flex unselectable">Total Supply</div>
        <div style={{ height: 5 }} />
        <div className="d-flex unselectable">
          {(token.total_supply.toFixed(0) * 1).toLocaleString()}
        </div>
      </div>
      <div
        className="flexRow flex-fill justify-content-center align-items-end"
        style={{ marginBottom: 5 }}
      >
        <div
          className={classnames("center", "unselectable", "buttonLight", {
            buttonActive: rangeSelected[0] === 1,
          })}
          style={{
            "--btnWidth": 30 + `px`,
            "--btnHeight": 30 + `px`,
            "--borderRadius": "8px 0 0 8px",
          }}
          onClick={() => Handler([1, 144, "histominute", 10])}
        >
          1D
        </div>
        <div
          className={classnames("center", "unselectable", "buttonLight", {
            buttonActive: rangeSelected[0] === 2,
          })}
          onClick={() => Handler([2, 168, "histohour"])}
          style={{
            "--btnWidth": 30 + `px`,
            "--btnHeight": 30 + `px`,
            "--borderRadius": "0px",
          }}
        >
          7D
        </div>
        <div
          className={classnames("center", "unselectable", "buttonLight", {
            buttonActive: rangeSelected[0] === 3,
          })}
          onClick={() => Handler([3, 144, "histohour", 5])}
          style={{
            "--btnWidth": 30 + `px`,
            "--btnHeight": 30 + `px`,
            "--borderRadius": "0px",
          }}
        >
          1M
        </div>
        <div
          className={classnames("center", "unselectable", "buttonLight", {
            buttonActive: rangeSelected[0] === 4,
          })}
          onClick={() => Handler([4, 182, "histoday", 2])}
          style={{
            "--btnWidth": 30 + `px`,
            "--btnHeight": 30 + `px`,
            "--borderRadius": "0 8px 8px 0",
          }}
        >
          1Y
        </div>
      </div>
    </div>
  );
}
