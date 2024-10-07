// src/components/WalletsWindow.js

import React, { useState, useEffect } from "react";
import IconButton from "../ui/IconButton";
import Icons from "../ui/Icons";
import classnames from "classnames";
import { getWalletsInfo } from "../../utils/getWalletsInfo";

function WalletsWindow({ expanded, walletsData, setWalletsData }) {
  const [availableWallets, setAvailableWallets] = useState([]);
  useEffect(() => {
    setAvailableWallets(getWalletsInfo);
  }, []);

  // Function to connect MetaMask

  async function connectToWallet(wallet) {
    console.log(`Connecting to ${wallet.info.name}...`);

    try {
      const accounts = await wallet.provider.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      console.log(`Connected to ${wallet.name} with account: ${account}`);
      return account;
    } catch (error) {
      console.log(`Failed to connect to ${wallet.name}:`, error);
    }
  }
  const handleWalletConnect = async (wallet) => {
    console.log(walletsData);
    if (Object.keys(walletsData).includes(wallet.info.name)) {
      let wallets = walletsData;
      delete wallets[wallet.info.name];
      setWalletsData({ ...wallets });
    } else {
      const connectedAccount = await connectToWallet(wallet);
      if (connectedAccount) {
        let wallets = walletsData;
        console.log("adding new wallet " + wallet);
        setWalletsData({ ...wallets, [wallet.info.name]: connectedAccount });
      }
    }
  };

  return (
    <div
      className={classnames(
        "d-flex",
        "flex-column",
        { walletsWindowExpanded: expanded },
        "walletsWindow",
        "justify-content-center",
        "align-items-center",
        "unselectable"
      )}
      style={{
        height: 150 * expanded + 80 * availableWallets.length * expanded,
      }}
    >
      {availableWallets.length !== 0 ? (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div
            className="d-flex flex-row textS1Light"
            style={{ marginTop: 10 }}
          >
            Add Wallets
          </div>
          {availableWallets.map((wallet, index) => (
            <div
              key={index}
              className="d-flex flex-row justify-content-center align-items-center"
              style={{ marginTop: 30 }}
            >
              {console.log(wallet)}
              <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ width: 82 }}
              >
                <img
                  alt={"icon"}
                  src={wallet.info.icon}
                  className="d-flex"
                  width="50"
                  height="50"
                ></img>
                <div className="d-flex textS2Light justify-content-center align-items-center unselectable">
                  {wallet.info.name}
                </div>
              </div>
              <div className="d-flex" style={{ width: 30 }}></div>
              {Object.keys(walletsData).includes(wallet.info.name) ? (
                <div
                  className="buttonLight d-flex justify-content-center align-items-center selectText"
                  onClick={() => handleWalletConnect(wallet)}
                  style={{ width: 120 }}
                >
                  <div>
                    {walletsData[wallet.info.name].substring(0, 6) +
                      "..." +
                      walletsData[wallet.info.name].substring(
                        walletsData[wallet.info.name].length - 4
                      )}
                  </div>
                </div>
              ) : (
                <IconButton
                  tooltipText={`Add ${wallet.info.name}`}
                  name={"Add"}
                  styleClass={"buttonLight"}
                  size={32}
                  onClick={() => handleWalletConnect(wallet)}
                ></IconButton>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{
            paddingLeft: 10,
            paddingTop: 20,
            paddingBottom: 10,
            paddingRight: 10,
          }}
        >
          {" "}
          <Icons name={"Error"} size={64}></Icons>
          <div className="d-flex textS1Light">
            No wallets detected in your browser
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletsWindow;
