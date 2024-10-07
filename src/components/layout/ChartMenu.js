import React from "react";

import Icons from "../ui/Icons";

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
        "d-flex",
        "flex-column",
        "justify-content-start",
        "align-items-center",
        "chartMenu"
      )}
    >
      <div className="d-flex flex-row justify-content-center align-items-center chartMenuTitle">
        <img
          className={"d-flex"}
          src={token.image}
          alt="Icon"
          style={{ width: 20 }}
        />
        <div style={{ width: 10 }}></div>
        {token.symbol.toUpperCase()}
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex flex-row justify-content-start align-items-center MenuText">
          <Icons name={"ArrowUp"} size={24}></Icons>
          <div style={{ width: 10 }}></div>
          {"$" + Math.max(...data)}
        </div>
        <div className="d-flex flex-row justify-content-start align-items-center MenuText">
          <Icons name={"ArrowDown"} size={24}></Icons>
          <div style={{ width: 10 }}></div>
          {"$" + Math.min(...data)}
        </div>
      </div>

      <div
        className="d-flex flex-column justify-content-start align-items-center MenuText"
        style={{ fontSize: 13 }}
      >
        <div className="d-flex">Market Cap</div>
        <div className="d-flex">{marketCap}</div>
      </div>
      <div
        className="d-flex flex-column justify-content-start align-items-center MenuText"
        style={{ fontSize: 13 }}
      >
        <div className="d-flex">Total Supply</div>
        <div className="d-flex">
          {(token.total_supply.toFixed(0) * 1).toLocaleString()}
        </div>
      </div>
      <div className="d-flex flex-fill flex-row justify-content-center align-items-end chartButtons">
        <div
          className={classnames(
            "d-flex",
            "justify-content-center",
            "align-items-center",
            "chartButton",
            { button_active: rangeSelected[0] === 1 }
          )}
          style={{ borderTopLeftRadius: 8, borderEndStartRadius: 8 }}
          onClick={() => Handler([1, 144, "histominute", 10])}
        >
          1D
        </div>
        <div
          className={classnames(
            "d-flex",
            "justify-content-center",
            "align-items-center",
            "chartButton",
            { button_active: rangeSelected[0] === 2 }
          )}
          onClick={() => Handler([2, 168, "histohour"])}
        >
          7D
        </div>
        <div
          className={classnames(
            "d-flex",
            "justify-content-center",
            "align-items-center",
            "chartButton",
            { button_active: rangeSelected[0] === 3 }
          )}
          onClick={() => Handler([3, 144, "histohour", 5])}
        >
          1M
        </div>
        <div
          className={classnames(
            "d-flex",
            "justify-content-center",
            "align-items-center",
            "chartButton",
            { button_active: rangeSelected[0] === 4 }
          )}
          style={{ borderEndEndRadius: 8, borderTopRightRadius: 8 }}
          onClick={() => Handler([4, 182, "histoday", 2])}
        >
          1Y
        </div>
      </div>
    </div>
  );
}
