import { useState, useEffect } from "react";

import "./styles/components.scss";
import "./styles/layout.scss";
import "./styles/utilities.scss";
import "./styles/media-queries.css";
import "./styles/variables.scss";

import AppHeader from "./layout/header/AppHeader";
import Content from "./layout/content/Content";
import TokensInfoProvider from "./components/TokensInfoProvider";
import Triangle from "./layout/Triangle";
import TokensSelect from "./layout/TokensSelect";
import { walletsListener } from "./utils/walletsListener";
import PopUp from "./components/shared/PopUp";

function App() {
  const [selectedToken1, setSelectedToken1] = useState();
  const [selectedToken2, setSelectedToken2] = useState();
  const [popUp, setPopUp] = useState({ visible: false });
  const [walletsList, setWalletsList] = useState([]);
  useEffect(() => {
    walletsListener();
  }, []);
  return (
    <TokensInfoProvider
      setSelectedToken1={setSelectedToken1}
      setSelectedToken2={setSelectedToken2}
    >
      <PopUp popUp={popUp} setPopUp={setPopUp} />
      <div className="flexColumn app">
        <AppHeader walletsList={walletsList} setWalletsList={setWalletsList} />
        <TokensSelect
          selectedToken1={selectedToken1}
          setSelectedToken1={setSelectedToken1}
          selectedToken2={selectedToken2}
          setSelectedToken2={setSelectedToken2}
        />
        <Triangle />
        <div className="d-flex" style={{ height: 100 }} />
        <Content
          token1={selectedToken1}
          token2={selectedToken2}
          setPopUp={setPopUp}
        />
      </div>
    </TokensInfoProvider>
  );
}

export default App;
