import { ReactComponent as MetamaskIcon } from "../icons/MetamaskLogo.svg";
import { ReactComponent as TrustIcon } from "../icons/TrustLogo.svg";
import { ReactComponent as CoinbaseIcon } from "../icons/CoinbaseLogo.svg";
import { ReactComponent as AppLogo } from "../icons/AppLogo.svg";
import { ReactComponent as Add } from "../icons/Add.svg";
import { ReactComponent as Wallet } from "../icons/Wallet.svg";
import { ReactComponent as ETH } from "../icons/ETH.svg";
import { ReactComponent as BNB } from "../icons/BNB.svg";
import { ReactComponent as USDT } from "../icons/USDT.svg";
import { ReactComponent as LINK } from "../icons/LINK.svg";
import { ReactComponent as DAI } from "../icons/DAI.svg";
import { ReactComponent as WBTC } from "../icons/WBTC.svg";
import { ReactComponent as Search } from "../icons/Search.svg";
import { ReactComponent as BackArrow } from "../icons/BackArrow.svg";
import { ReactComponent as RightArrow } from "../icons/RightArrow.svg";
import { ReactComponent as Swap } from "../icons/Swap.svg";
import { ReactComponent as Handshake } from "../icons/Handshake.svg";
import { ReactComponent as Rate } from "../icons/Rate.svg";
import { ReactComponent as Approve } from "../icons/Approve.svg";
import { ReactComponent as Error } from "../icons/Error.svg";
import { ReactComponent as ArrowUp } from "../icons/ArrowUp.svg";
import { ReactComponent as ArrowDown } from "../icons/ArrowDown.svg";
import { ReactComponent as Cancel } from "../icons/Cancel.svg";

const Icons = ({ name, size, visible }) => {
  const IconComponent = {
    MetamaskIcon: MetamaskIcon,
    TrustIcon: TrustIcon,
    CoinbaseIcon: CoinbaseIcon,
    AppLogo: AppLogo,
    Add: Add,
    Wallet: Wallet,
    ETH: ETH,
    BNB: BNB,
    USDT: USDT,
    LINK: LINK,
    DAI: DAI,
    WBTC: WBTC,
    Search: Search,
    BackArrow: BackArrow,
    RightArrow: RightArrow,
    Swap: Swap,
    Handshake: Handshake,
    Rate: Rate,
    Approve: Approve,
    Error: Error,
    ArrowUp: ArrowUp,
    ArrowDown: ArrowDown,
    Cancel: Cancel,
  }[name];

  if (!IconComponent) return null;

  return (
    <IconComponent
      width={size}
      height={size}
      aria-labelledby={name}
      role="img"
    />
  );
};

export default Icons;
