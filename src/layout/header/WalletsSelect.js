import React, { useState, useEffect } from "react";
import IconButton from "../../components/shared/IconButton";
import Icons from "../../components/shared/Icon";
import classnames from "classnames";
import { getWalletsList } from "../../utils/walletsListener";

function WalletsSelect({ expanded, walletsList, setWalletsList }) {
  const [availableWallets, setAvailableWallets] = useState([]);
  useEffect(() => {
    setAvailableWallets(getWalletsList);
  }, []);

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
    if (Object.keys(walletsList).includes(wallet.info.name)) {
      let wallets = walletsList;
      delete wallets[wallet.info.name];
      setWalletsList({ ...wallets });
    } else {
      const connectedAccount = await connectToWallet(wallet);
      if (connectedAccount) {
        let wallets = walletsList;
        console.log("adding new wallet " + wallet);
        setWalletsList({ ...wallets, [wallet.info.name]: connectedAccount });
      }
    }
  };

  return (
    <div
      className={classnames(
        "flexColumn",
        { walletsSelectExpanded: expanded },
        "walletsSelect",
        "center",
        "unselectable"
      )}
      style={{
        height: 150 * expanded + 80 * availableWallets.length * expanded,
      }}
    >
      {availableWallets.length !== 0 ? (
        <div className="flexColumn center">
          <div className="flexRow textLight" style={{ marginTop: 10 }}>
            Add Wallets
          </div>
          {availableWallets.map((wallet, index) => (
            <div
              key={index}
              className="flexRow center"
              style={{ marginTop: 30 }}
            >
              <div className="flexColumn center" style={{ width: 82 }}>
                <img
                  alt={"icon"}
                  src={wallet.info.icon}
                  className="d-flex"
                  width="50"
                  height="50"
                ></img>
                <div
                  className="center textLight unselectable"
                  style={{
                    "--fontSize": "15px",
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                >
                  {wallet.info.name}
                </div>
              </div>
              <div className="d-flex" style={{ width: 30 }}></div>
              {Object.keys(walletsList).includes(wallet.info.name) ? (
                <div
                  className="center buttonLight selectText"
                  onClick={() => handleWalletConnect(wallet)}
                  style={{ width: 120 }}
                >
                  <div>
                    {walletsList[wallet.info.name].substring(0, 6) +
                      "..." +
                      walletsList[wallet.info.name].substring(
                        walletsList[wallet.info.name].length - 4
                      )}
                  </div>
                </div>
              ) : (
                <IconButton
                  name={"Add"}
                  tooltipText={`Add ${wallet.info.name}`}
                  styleClass={"buttonLight"}
                  onClick={() => handleWalletConnect(wallet)}
                  btnWidth={60}
                  btnHeight={50}
                  borderRadius="45px"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flexColumn center" style={{ color: "#ffe8ff" }}>
          <Icons name={"Error"} size={64} />
          <div className="d-flex unselectable">
            No wallets detected in your browser
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletsSelect;
