import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import Icons from "../ui/Icons";
import LineChart from "../ui/lineChart";
import { useCrypto } from "../../utils/CryptoPrices";
import { Overlay } from "react-bootstrap";

function HeaderPricePanel({
  name,
  onClick,
  styleClass,
  size = 32,
  tooltipText = name,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [color, setColor] = useState("#007e71");
  const [data, setData] = useState({ values: [], timestamps: [], change: 0 });
  const [hoverTimer, setHoverTimer] = useState(null);
  const target = useRef(null);
  const { cryptoPrices, newCrypto, isReady, getCryptoPrice, loadingRef } =
    useCrypto();
  useEffect(() => {
    if (!cryptoPrices.histominute[name] && !loadingRef.current[name]) {
      loadingRef.current[name] = true;
      newCrypto(name, 2000, "histominute")
        .then(() => {
          loadingRef.current[name] = false;
        })
        .catch(() => {
          loadingRef.current[name] = false;
        });
    }
  }, []);

  useEffect(() => {
    let timestamps = [];
    let values = [];
    //console.log(cryptoPrices);
    if (
      cryptoPrices.histominute &&
      cryptoPrices.histominute[name] &&
      !loadingRef.current[name]
    ) {
      let newData = getCryptoPrice(name, 24, "histominute", 60);
      timestamps = newData.map((item) => item[0]);
      values = newData.map((item) => item[1]);
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
      setColor(values[0] <= values[values.length - 1] ? "#007e71" : "#7e0000");
    }
  }, [cryptoPrices.histominute[name]]);

  const handleMouseEnter = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    const timer = setTimeout(() => {
      setHoverTimer(null);
      setShowTooltip(true);
    }, 800);
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer);
    setHoverTimer(null);
    setShowTooltip(false);
  };

  const tooltip = ({
    placement: _placement,
    arrowProps: _arrowProps,
    show: _show,
    popper: _popper,
    hasDoneInitialMeasure: _hasDoneInitialMeasure,
    ...props
  }) => (
    <div
      {...props}
      style={{
        ...props.style,
        backgroundColor: "#563964cd",
        position: "fixed",
        margin: "5px 0px 0px 0px",
        padding: "0px 5px 0px 5px",
        color: "#d5b3e5c9",
        backdropFilter: "blur(5px)",
        fontSize: "12px",
        zIndex: 1024,
        borderRadius: 16,
      }}
    >
      {tooltipText}
    </div>
  );

  return (
    <div
      ref={target}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={classnames(
        styleClass,
        "d-flex",
        "flex-row",
        "justify-content-center",
        "align-items-center",
        { "d-none": data.values.length === 0 }
      )}
      id={name}
      type="button"
      role="button"
      aria-label={`Option for ${name}`}
    >
      <Icons className={"d-flex"} name={name} size={size} />
      <div className="d-flex flex-column">
        <LineChart
          styleClass={"HeaderChart"}
          isReady={isReady}
          data={data.values}
          labels={data.timestamps}
          color={color}
        ></LineChart>
        <div
          style={{ height: 15, color: color }}
          className="d-flex HeaderText justify-content-center unselectable"
        >
          {(data.values[data.values.length - 1] + "").slice(0, 8) + "$"}
        </div>
      </div>
      <div
        style={{ width: 30, paddingLeft: 3 }}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <div
          style={{ height: 10 }}
          className="d-flex HeaderText2 justify-content-center align-items-center unselectable"
        >
          24h
        </div>
        <div
          style={{ height: 10, marginTop: 5, color: color }}
          className="d-flex HeaderText justify-content-center align-items-center unselectable"
        >
          {data.change}
        </div>
      </div>
      <Overlay target={target.current} show={showTooltip} placement="bottom">
        {tooltip}
      </Overlay>
    </div>
  );
}

export default HeaderPricePanel;
