import IconButton from "../../components/shared/IconButton";
import React from "react";
import { useState } from "react";
import Icons from "../../components/shared/Icon";
import WalletsSelect from "./WalletsSelect";
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
        "flexRow",
        "justify-content-end",
        "appHeader",
        "inner-shadow"
      )}
    >
      <div className="flexRow align-items-center appHeaderLeft">
        <Icons name={"AppLogo"} size={90}></Icons>
        <HeaderPricePanel name={"ETH"} />
        <HeaderPricePanel name={"USDT"} />
        <HeaderPricePanel name={"BNB"} />
        <HeaderPricePanel name={"LINK"} />
        <HeaderPricePanel name={"DAI"} />
        <HeaderPricePanel name={"WBTC"} />
      </div>
      <div
        className="flexRow appHeaderRight center"
        style={{ paddingRight: 35 }}
      >
        <IconButton
          name={"Wallet"}
          tooltipText={"Add Wallets"}
          styleClass={"buttonDark"}
          activeStyleClass={"buttonActive"}
          onClick={handleWalletClick}
          active={expanded}
          btnWidth={60}
          btnHeight={50}
          borderRadius="45px"
          zIndex={10}
        />
        <WalletsSelect
          expanded={expanded}
          walletsList={walletsList}
          setWalletsList={setWalletsList}
        ></WalletsSelect>
      </div>
    </div>
  );
}
