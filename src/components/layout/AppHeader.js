import IconButton from "../ui/IconButton";
import React from "react";
import { useState } from "react";
import Icons from "../ui/Icons";
import WalletsWindow from "./WalletsWindow";
import HeaderPricePanel from "./HeaderPricePanel";
var classnames = require("classnames");

export default function AppHeader({ walletsData, setWalletsData }) {
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
        <HeaderPricePanel
          name={"ETH"}
          size={48}
          styleClass={"HeaderPricePanel"}
        ></HeaderPricePanel>
        <HeaderPricePanel
          name={"USDT"}
          size={48}
          styleClass={"HeaderPricePanel"}
        ></HeaderPricePanel>
        <HeaderPricePanel
          name={"BNB"}
          size={48}
          styleClass={"HeaderPricePanel"}
        ></HeaderPricePanel>
        <HeaderPricePanel
          name={"LINK"}
          size={48}
          styleClass={"HeaderPricePanel"}
        ></HeaderPricePanel>
        <HeaderPricePanel
          name={"DAI"}
          size={48}
          styleClass={"HeaderPricePanel"}
        ></HeaderPricePanel>
        <HeaderPricePanel
          name={"WBTC"}
          size={48}
          styleClass={"HeaderPricePanel"}
        ></HeaderPricePanel>
      </div>
      <div
        className="appHeaderPart2 d-flex
        flex-row"
      >
        <IconButton
          name={"Wallet"}
          tooltipText={"Add wallets"}
          styleClass={"buttonDark buttonWallet"}
          activeStyleClass={"buttonActive buttonWallet"}
          onClick={handleWalletClick}
          expanded={expanded}
          size={32}
        ></IconButton>
        <WalletsWindow
          expanded={expanded}
          walletsData={walletsData}
          setWalletsData={setWalletsData}
        ></WalletsWindow>
      </div>
    </div>
  );
}
