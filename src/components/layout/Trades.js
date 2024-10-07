import React, { useState, useRef, useEffect } from "react";
import CreateTrade from "./CreateTrade";
import { useCrypto } from "../../utils/CryptoPrices";
import TradeList from "./TradeList";
import classnames from "classnames";

function Trades({ token1, token2, settings, setSettings }) {
  const { cryptoPrices, loadingRef } = useCrypto();
  const [swaps, setSwaps] = useState([]);
  const parentRef = useRef(null);
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === parentRef.current.firstChild) {
          console.log("setttt change");
          console.log(parentRef.current.lastChild);
          setWidth(entry.contentRect.width + 30);
        }
      }
    });

    if (parentRef.current && parentRef.current.firstChild) {
      resizeObserver.observe(parentRef.current.firstChild);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={parentRef}
      className={classnames(
        "d-flex",
        "flex-column",
        "justify-content-start",
        "align-items-center",
        "trades"
      )}
    >
      <CreateTrade
        cryptoPrices={cryptoPrices}
        loadingRef={loadingRef}
        token1={token1}
        token2={token2}
        swaps={swaps}
        setSwaps={setSwaps}
        width={width}
        settings={settings}
        setSettings={setSettings}
      ></CreateTrade>
      <TradeList swaps={swaps} width={width} />
    </div>
  );
}

export default Trades;
