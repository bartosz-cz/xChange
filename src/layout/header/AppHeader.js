import IconButton from "../../components/shared/IconButton";
import React from "react";
import { useState } from "react";
import Icons from "../../components/shared/Icon";
import WalletsWindow from "./WalletsWindow";
import HeaderPricePanel from "./HeaderPricePanel";
var classnames = require("classnames");

export default function AppHeader({ walletsList, setWalletsList }) {
  const [expanded, setExpanded] = useState(false);
  const handleWalletClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={classnames(
        "d-flex",
        "flex-row",
        "justify-content-end",
        "appHeader",
        "inner-shadow"
      )}
    >
      <div className="appHeaderPart1 d-flex flex-row align-items-center">
        <Icons name={"AppLogo"} size={90}></Icons>
        <HeaderPricePanel name={"ETH"} />
        <HeaderPricePanel name={"USDT"} />
        <HeaderPricePanel name={"BNB"} />
        <HeaderPricePanel name={"LINK"} />
        <HeaderPricePanel name={"DAI"} />
        <HeaderPricePanel name={"WBTC"} />
      </div>
      <div
        className="appHeaderPart2 d-flex
        flex-row"
      >
        <IconButton
          name={"Wallet"}
          tooltipText={"Add Wallets"}
          styleClass={"buttonDark buttonWallet"}
          activeStyleClass={"buttonActive buttonWallet"}
          onClick={handleWalletClick}
          expanded={expanded}
        ></IconButton>
        <WalletsWindow
          expanded={expanded}
          walletsList={walletsList}
          setWalletsList={setWalletsList}
        ></WalletsWindow>
      </div>
    </div>
  );
}
