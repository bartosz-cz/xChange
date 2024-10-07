import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import { download, save } from "../utils/manageStorage";

const CryptoContext = createContext();

export const useCrypto = () => useContext(CryptoContext);

export const CryptoProvider = ({
  children,
  setSelectedToken1,
  setSelectedToken2,
}) => {
  const [cryptoPrices, setCryptoPrices] = useState({
    histoday: {},
    histohour: {},
    histominute: {},
  });
  const [erc20Tokens, setErc20Tokens] = useState({});
  const [isReady, setIsReady] = useState(false);
  const loadingRef = useRef({});
  const cryptoPricesRef = useRef(cryptoPrices);
  useEffect(() => {
    cryptoPricesRef.current = cryptoPrices;
  }, [cryptoPrices]);

  const fetchHistoryData = async (id, time, resolution) => {
    try {
      //console.log("asked " + resolution);
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/v2/` + resolution,
        {
          params: {
            fsym: id,
            tsym: "USD",
            limit: time,
            api_key:
              "6be12f94e77ff94a4d11ea141fa0c9671d4c75c47e75a4725ba5c35ee8091ae6", // Replace with your CryptoCompare API key
          },
        }
      );
      // console.log("Gathered " + resolution);
      // console.log(response.data.Data.Data);
      return response.data.Data.Data.map((point) => [
        point.time * 1000,
        point.close,
      ]);
    } catch (error) {
      console.error(`Error fetching 24-hour data for ${id}:`, error);
      return [];
    }
  };

  const fetchLatestPrices = async (ids) => {
    try {
      //console.log("asked multi");
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/pricemulti`,
        {
          params: {
            fsyms: ids.join(","),
            tsyms: "USD",
            api_key:
              "6be12f94e77ff94a4d11ea141fa0c9671d4c75c47e75a4725ba5c35ee8091ae6",
          },
        }
      );

      const currentTime = Date.now();
      let newData = {};
      // console.log(response.data);
      ids.forEach((id) => {
        if (response.data[id])
          newData[id] = [currentTime, response.data[id].USD];
      });
      //console.log(newData);
      return newData;
    } catch (error) {
      console.error("Error fetching latest prices:", error);
      return {};
    }
  };

  const initiateCrypto = async (name, range, updateTime) => {
    console.log("initialize  " + name + "  " + range + "  " + updateTime);

    let newData = await fetchHistoryData(name, range, updateTime);

    //.log("New Crypto Data:");
    //console.log(newData);

    setCryptoPrices((prev) => {
      const updatedData = {
        ...prev,
        [updateTime]: { ...prev[updateTime], [name]: newData },
      };
      // console.log("saving new cryptoPrices");
      //console.log(updatedData);
      //save("cryptoPrices", updatedData);
      return updatedData;
    });
  };

  let dayTimer = 0;
  let hourTimer = 0;
  const updateData = async () => {
    console.log("supose update");
    dayTimer += 1;
    hourTimer += 1;
    //console.log(cryptoPrices);
    let IdsToUpdateM = Object.keys(cryptoPricesRef.current.histominute);
    //console.log(IdsToUpdateM);
    let IdsToUpdateH = [];
    let IdsToUpdateD = [];
    if (dayTimer === 1440) {
      dayTimer = 0;
      IdsToUpdateD = Object.keys(cryptoPricesRef.current.histoday);
    } else if (hourTimer === 60) {
      hourTimer = 0;
      IdsToUpdateH = Object.keys(cryptoPricesRef.current.histohour);
    }
    let allIds = IdsToUpdateM.concat(IdsToUpdateH).concat(IdsToUpdateD);
    let newData = {};
    if (allIds.length !== 0) {
      //console.log(allIds);
      newData = await fetchLatestPrices(allIds);
      //console.log(newData);
      //console.log("updateeeeeeeeeee");
      setCryptoPrices((prev) => {
        const updatedData = {
          histominute: { ...prev.histominute }, // Copy existing data for immutability
          histohour: { ...prev.histohour }, // Copy existing data for immutability
          histoday: { ...prev.histoday }, // Copy existing data for immutability
        };

        // Iterate through new data and update histominute, histohour, histoday
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
          //console.log(IdsToUpdateD);
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

        // console.log("Updated Crypto Prices:", updatedData);
        //save("cryptoPrices", updatedData);
        return updatedData; // Return the updated data to update the state
      });
    }
  };

  async function fetchErc20TokenIds() {
    const url =
      "https://api.coingecko.com/api/v3/coins/list?include_platform=true";
    try {
      const response = await axios.get(url);
      const tokens = response.data;
      // Filter tokens that are specifically on the Ethereum platform
      //console.log(tokens);
      const ethereumTokens = tokens.filter(
        (token) =>
          (token.platforms && token.platforms.ethereum) ||
          token.symbol === "eth"
      );
      const limitedEthereumTokens = ethereumTokens;
      //console.log(limitedEthereumTokens);
      return limitedEthereumTokens.reduce((acc, token) => {
        acc[token.id] = token.platforms.ethereum;
        return acc;
      }, {});
    } catch (error) {
      console.error("Failed to fetch ERC-20 tokens:", error);
      return [];
    }
  }

  async function fetchErc20Tokens() {
    const erc20TokenData = await fetchErc20TokenIds(); // Get ERC-20 token IDs
    const erc20TokenIds = Object.keys(erc20TokenData);
    const url = "https://api.coingecko.com/api/v3/coins/markets";
    const params = {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 250,
      page: 1,
      sparkline: false,
    };

    try {
      const response = await axios.get(url, { params });
      const allTokens = response.data;
      // Further filter the tokens to ensure they are ERC-20 (cross-referencing)
      let Tokens = allTokens.filter((token) =>
        erc20TokenIds.includes(token.id)
      );
      Tokens = Tokens.map((token) => ({
        ...token,
        address: erc20TokenData[token.id], // Add the Ethereum address from the erc20TokenData object
      }));
      //console.log(Tokens);
      /*Tokens.unshift({
        symbol: "ETH",
        image:
          "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
      });*/
      setErc20Tokens(Tokens);
      save("List", Tokens);
      return Tokens;
    } catch (error) {
      console.error("Failed to fetch detailed ERC-20 token data:", error);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        /*const savedData = download("cryptoPrices");
        if (savedData) {
          console.log("data Loaded");
          setCryptoPrices(savedData);
        }*/

        let savedList = download("List");
        if (savedList) {
          console.log("data Loaded");
          setErc20Tokens(savedList);
        } else {
          savedList = await fetchErc20Tokens();
        }
        setSelectedToken1(savedList[0]);
        setSelectedToken2(savedList[1]);
      } finally {
        setIsReady(true);
        console.log("set to true");
      }
    };
    loadData();
    const intervalId = setInterval(() => {
      updateData();
    }, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  async function newCrypto(name, range, updateTime) {
    initiateCrypto(name, range, updateTime);
  }

  function getCryptoPrice(name, range, updateTime, downSampling = undefined) {
    let data = cryptoPrices[updateTime][name];
    //console.log(cryptoPrices);
    //console.log("Retrieved data " + name + " range: " + range);
    //console.log(data);
    if (data) {
      if (downSampling === undefined) {
        return data.slice(data.length - range - 1, data.length - 1);
      } else {
        let result = [];
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
      //console.log("INITIATE NEW CRY[TOOOO");
      initiateCrypto(name, 2000, updateTime);
    }
  }

  function stopCrypto() {}

  if (!isReady) {
    return <div></div>;
  } else {
    return (
      <CryptoContext.Provider
        value={{
          cryptoPrices,
          newCrypto,
          stopCrypto,
          isReady,
          erc20Tokens,
          getCryptoPrice,
          loadingRef,
        }}
      >
        {children}
      </CryptoContext.Provider>
    );
  }
};
