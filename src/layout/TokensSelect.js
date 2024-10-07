import IconButton from "../components/shared/IconButton";
import React from "react";
import { useState, useEffect } from "react";
import FormSelect from "../components/shared/FormSelect";
import useCrypto from "../hooks/useCrypto";

var classnames = require("classnames");

export default function TokensSelect({
  selectedToken1,
  setSelectedToken1,
  selectedToken2,
  setSelectedToken2,
}) {
  const [expanded, setExpanded] = useState(true);
  const { erc20Tokens, newCrypto, cryptoPrices, loadingRef } = useCrypto();

  useEffect(() => {
    initiateToken(selectedToken1.symbol.toUpperCase());
  }, [selectedToken1]);

  useEffect(() => {
    initiateToken(selectedToken2.symbol.toUpperCase());
  }, [selectedToken2]);

  const initiateToken = (name) => {
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
  };

  const mouseHandler = (state) => {
    setExpanded(state);
  };

  const reverseHandler = () => {
    let token = selectedToken1;
    setSelectedToken1(selectedToken2);
    setSelectedToken2(token);
  };

  return (
    <div
      className={classnames(
        "d-flex",
        "flex-row",
        "justify-content-start",
        "align-items-center",
        "search",
        { searchExpanded: expanded },
        { customBorder: expanded }
      )}
    >
      <IconButton
        name={"RightArrow"}
        onClick={() => mouseHandler(true)}
        tooltipActive={false}
        styleClass={"searchButton"}
        visible={!expanded}
      />
      <IconButton
        name={"BackArrow"}
        onClick={() => mouseHandler(false)}
        tooltipActive={false}
        styleClass={"BackButton"}
        visible={expanded}
      />
      <div style={{ width: 30 }}></div>
      <FormSelect
        visible={expanded}
        selectedToken={selectedToken1}
        setSelectedToken={setSelectedToken1}
        selectedToken2={selectedToken2}
        erc20Tokens={erc20Tokens}
      />
      <div style={{ width: 20 }}></div>
      <IconButton
        name={"Swap"}
        onClick={reverseHandler}
        tooltipActive={false}
        styleClass={""}
        visible={expanded}
      />
      <div style={{ width: 20 }}></div>
      <FormSelect
        visible={expanded}
        selectedToken={selectedToken2}
        setSelectedToken={setSelectedToken2}
        selectedToken2={selectedToken1}
        erc20Tokens={erc20Tokens}
      />
      <div style={{ width: 30 }}></div>
    </div>
  );
}
