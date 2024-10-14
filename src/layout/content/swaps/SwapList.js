import React from "react";
import Icons from "../../../components/shared/Icon";

var classnames = require("classnames");

export default function SwapList({ swaps, width }) {
  return (
    <div className="flexColumn center swapList" style={{ width: `${width}px` }}>
      <div
        className={classnames(
          "flexColumn",
          { "justify-content-start": swaps.length !== 0 },
          { "justify-content-center": swaps.length === 0 },
          "align-items-center",
          "swapContainer",
          "custom-scrollbar"
        )}
      >
        {swaps.length !== 0 ? (
          swaps
        ) : (
          <div className="flexColumn center">
            <Icons name={"Error"} size={64} />
            <div className="d-flex unselectable">No Active Swaps</div>
          </div>
        )}
      </div>
    </div>
  );
}
