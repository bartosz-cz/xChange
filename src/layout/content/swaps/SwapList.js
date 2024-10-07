import React from "react";
import Icons from "../../../components/shared/Icon";

var classnames = require("classnames");

export default function SwapList({ swaps, width }) {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center tradeList customBorder"
      style={{ width: `${width}px` }}
    >
      <div
        className={classnames(
          "d-flex",
          "flex-column",
          { "justify-content-start": swaps.length !== 0 },
          { "justify-content-center": swaps.length === 0 },
          "align-items-center",
          "tradeContainer",
          "custom-scrollbar"
        )}
      >
        {swaps.length !== 0 ? (
          swaps
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center tradesPlaceholder">
            <Icons name={"Error"} size={64} />
            <div className="d-flex">No Active Swaps</div>
          </div>
        )}
      </div>
    </div>
  );
}
