import { useState, useEffect } from "react";
import "./App.css";
import AppHeader from "./components/layout/AppHeader";
import Content from "./components/layout/Content";
import { CryptoProvider } from "./utils/CryptoPrices";
import Triangle from "./components/ui/Triangle";
import Search from "./components/layout/search";
import { WalletsInfoListener } from "./utils/getWalletsInfo";
import ApproveWindow from "./components/layout/ApproveWindow";

function App() {
  const [selectedToken1, setSelectedToken1] = useState();
  const [selectedToken2, setSelectedToken2] = useState();
  const [settings, setSettings] = useState({ visible: false });
  const [walletsData, setWalletsData] = useState([]);
  useEffect(() => {
    WalletsInfoListener();
  }, []);
  return (
    <CryptoProvider
      setSelectedToken1={setSelectedToken1}
      setSelectedToken2={setSelectedToken2}
    >
      <ApproveWindow
        settings={settings}
        setSettings={setSettings}
      ></ApproveWindow>
      <div className="d-flex flex-column app ">
        <AppHeader
          walletsData={walletsData}
          setWalletsData={setWalletsData}
        ></AppHeader>
        <Search
          selectedToken1={selectedToken1}
          setSelectedToken1={setSelectedToken1}
          selectedToken2={selectedToken2}
          setSelectedToken2={setSelectedToken2}
        ></Search>
        <Triangle></Triangle>
        <div className="d-flex" style={{ height: 100 }}></div>
        <Content
          token1={selectedToken1}
          token2={selectedToken2}
          settings={settings}
          setSettings={setSettings}
        ></Content>
      </div>
    </CryptoProvider>
  );
}

export default App;
