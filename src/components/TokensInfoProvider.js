import React, { useState, useEffect, useRef } from "react";
import CryptoContext from "../contexts/CryptoContext";
import {
  fetchHistoryData,
  fetchLatestPrices,
  fetchErc20Tokens,
} from "../api/cryptoInfoApi";
import { download, save } from "../utils/manageStorage";
import LoadingScreen from "../layout/LoadingScreen";

const TokensInfoProvider = ({
  children,
  setSelectedToken1,
  setSelectedToken2,
}) => {
  const [cryptoPrices, setCryptoPrices] = useState({
    histoday: {},
    histohour: {},
    histominute: {},
  });
  const [erc20Tokens, setErc20Tokens] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Tokens data...");
  const loadingRef = useRef({});
  const cryptoPricesRef = useRef(cryptoPrices);

  useEffect(() => {
    cryptoPricesRef.current = cryptoPrices;
  }, [cryptoPrices]);

  const initiateCrypto = async (name, range, updateTime) => {
    console.log("Initializing:", name, range, updateTime);
    const newData = await fetchHistoryData(name, range, updateTime);

    setCryptoPrices((prev) => ({
      ...prev,
      [updateTime]: { ...prev[updateTime], [name]: newData },
    }));
    return newData;
  };

  let dayTimer = 0;
  let hourTimer = 0;

  const updateData = async () => {
    console.log("Updating data");
    dayTimer += 1;
    hourTimer += 1;

    const IdsToUpdateM = Object.keys(cryptoPricesRef.current.histominute);
    let IdsToUpdateH = [];
    let IdsToUpdateD = [];

    if (dayTimer === 1440) {
      dayTimer = 0;
      IdsToUpdateD = Object.keys(cryptoPricesRef.current.histoday);
    } else if (hourTimer === 60) {
      hourTimer = 0;
      IdsToUpdateH = Object.keys(cryptoPricesRef.current.histohour);
    }

    const allIds = [...IdsToUpdateM, ...IdsToUpdateH, ...IdsToUpdateD];
    if (allIds.length !== 0) {
      const newData = await fetchLatestPrices(allIds);
      setCryptoPrices((prev) => {
        const updatedData = {
          histominute: { ...prev.histominute },
          histohour: { ...prev.histohour },
          histoday: { ...prev.histoday },
        };

        Object.entries(newData).forEach(([name, newValue]) => {
          if (updatedData.histominute[name]) {
            updatedData.histominute[name] = [
              ...updatedData.histominute[name],
              newValue,
            ];
          } else {
            updatedData.histominute[name] = [newValue];
          }

          if (IdsToUpdateH.includes(name)) {
            if (updatedData.histohour[name]) {
              updatedData.histohour[name] = [
                ...updatedData.histohour[name],
                newValue,
              ];
            } else {
              updatedData.histohour[name] = [newValue];
            }
          }

          if (IdsToUpdateD.includes(name)) {
            if (updatedData.histoday[name]) {
              updatedData.histoday[name] = [
                ...updatedData.histoday[name],
                newValue,
              ];
            } else {
              updatedData.histoday[name] = [newValue];
            }
          }
        });
        return updatedData;
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        let savedList = download("List");
        if (savedList) {
          console.log("Data loaded from storage");
          setErc20Tokens(savedList);
        } else {
          savedList = await fetchErc20Tokens();
          setErc20Tokens(savedList);
          save("List", savedList);
        }
        setSelectedToken1(savedList[0]);
        setSelectedToken2(savedList[1]);
        setProgress(0.4);
        setProgressText("Gathering prices...");
        let headerCryptoNames = ["ETH", "USDT", "BNB", "LINK", "DAI", "WBTC"];
        for (let [index, name] of headerCryptoNames.entries()) {
          let data = await initiateCrypto(name, 2000, "histominute");
          if (data.length === 0) throw new Error("No internet connection");

          setProgress(0.4 + index * 0.1);
        }
        setProgress(1);
        setIsReady(true);
      } catch {
        setProgressText("Error: Check your internet connection");
      }
    };
    loadData();
    const intervalId = setInterval(updateData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const newCrypto = async (name, range, updateTime) => {
    initiateCrypto(name, range, updateTime);
  };

  const getCryptoPrice = (
    name,
    range,
    updateTime,
    downSampling = undefined
  ) => {
    const data = cryptoPrices[updateTime][name];
    if (data) {
      if (downSampling === undefined) {
        return data.slice(data.length - range - 1, data.length - 1);
      } else {
        const result = [];
        for (
          let i = data.length - downSampling * range - 1;
          i < data.length;
          i += downSampling
        ) {
          result.push(data[i]);
        }
        return result;
      }
    } else {
      initiateCrypto(name, 2000, updateTime);
    }
  };

  if (!isReady) {
    return <LoadingScreen progress={progress} text={progressText} />;
  }

  return (
    <CryptoContext.Provider
      value={{
        cryptoPrices,
        newCrypto,
        isReady,
        erc20Tokens,
        getCryptoPrice,
        loadingRef,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export default TokensInfoProvider;
