import React, { useState, useRef, useEffect } from "react";
import CreateSwap from "./CreateSwap";
import useCrypto from "../../../hooks/useCrypto";
import SwapList from "./SwapList";
import classnames from "classnames";

function SwapsManagement({ token1, token2, setPopUp }) {
  const { cryptoPrices, loadingRef } = useCrypto();
  const [swaps, setSwaps] = useState([]);
  const parentRef = useRef(null);
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === parentRef.current.firstChild) {
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
      <CreateSwap
        cryptoPrices={cryptoPrices}
        loadingRef={loadingRef}
        token1={token1}
        token2={token2}
        swaps={swaps}
        setSwaps={setSwaps}
        width={width}
        setPopUp={setPopUp}
      />
      <SwapList swaps={swaps} width={width} />
    </div>
  );
}

export default SwapsManagement;
