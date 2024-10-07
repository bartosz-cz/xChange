import IconButton from "../ui/IconButton";
import React from "react";
import { useState, useEffect } from "react";
import FormSelect from "../ui/FormSelect";
import Icons from "../ui/Icons";
import { useCrypto } from "../../utils/CryptoPrices";

var classnames = require("classnames");

export default function Search({
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
        activeStyleClass={"buttonActive"}
        size={32}
        visible={!expanded}
      ></IconButton>
      <IconButton
        name={"BackArrow"}
        onClick={() => mouseHandler(false)}
        tooltipActive={false}
        styleClass={"BackButton"}
        activeStyleClass={"buttonActive"}
        size={32}
        visible={expanded}
      ></IconButton>
      <div style={{ width: 30 }}></div>
      <FormSelect
        visible={expanded}
        styleClass={"selectCrypto"}
        activeStyleClass={"selectCryptoActive"}
        selectedToken={selectedToken1}
        setSelectedToken={setSelectedToken1}
        selectedSecondToken={selectedToken2}
        erc20Tokens={erc20Tokens}
      ></FormSelect>
      <div style={{ width: 20 }}></div>
      <div
        type="button"
        role="button"
        onClick={reverseHandler}
        className={classnames({ "d-none": !expanded })}
      >
        <Icons name={"Swap"} size={32} />
      </div>
      <div style={{ width: 20 }}></div>
      <FormSelect
        visible={expanded}
        styleClass={"selectCrypto"}
        activeStyleClass={"selectCryptoActive"}
        selectedToken={selectedToken2}
        setSelectedToken={setSelectedToken2}
        selectedSecondToken={selectedToken1}
        erc20Tokens={erc20Tokens}
      ></FormSelect>
      <div style={{ width: 30 }}></div>
    </div>
  );
}
