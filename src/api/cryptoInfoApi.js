// api/cryptoApi.js
import axios from "axios";

const CRYPTO_COMPARE_API_KEY =
  "6be12f94e77ff94a4d11ea141fa0c9671d4c75c47e75a4725ba5c35ee8091ae6";

export const fetchHistoryData = async (id, time, resolution) => {
  try {
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/${resolution}`,
      {
        params: {
          fsym: id,
          tsym: "USD",
          limit: time,
          api_key: CRYPTO_COMPARE_API_KEY,
        },
      }
    );
    return response.data.Data.Data.map((point) => [
      point.time * 1000,
      point.close,
    ]);
  } catch (error) {
    console.error(`Error fetching ${resolution} data for ${id}:`, error);
    return [];
  }
};

export const fetchLatestPrices = async (ids) => {
  try {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/pricemulti",
      {
        params: {
          fsyms: ids.join(","),
          tsyms: "USD",
          api_key: CRYPTO_COMPARE_API_KEY,
        },
      }
    );

    const currentTime = Date.now();
    let newData = {};

    ids.forEach((id) => {
      if (response.data[id]) {
        newData[id] = [currentTime, response.data[id].USD];
      }
    });

    return newData;
  } catch (error) {
    console.error("Error fetching latest prices:", error);
    return {};
  }
};

export const fetchErc20TokenIds = async () => {
  const url =
    "https://api.coingecko.com/api/v3/coins/list?include_platform=true";
  try {
    const response = await axios.get(url);
    const tokens = response.data;

    const ethereumTokens = tokens.filter(
      (token) =>
        (token.platforms && token.platforms.ethereum) || token.symbol === "eth"
    );

    return ethereumTokens.reduce((acc, token) => {
      acc[token.id] = token.platforms.ethereum;
      return acc;
    }, {});
  } catch (error) {
    console.error("Failed to fetch ERC-20 tokens:", error);
    return {};
  }
};

export const fetchErc20Tokens = async () => {
  const erc20TokenData = await fetchErc20TokenIds();
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
    let tokens = allTokens.filter((token) => erc20TokenIds.includes(token.id));
    tokens = tokens.map((token) => ({
      ...token,
      address: erc20TokenData[token.id],
    }));
    return tokens;
  } catch (error) {
    console.error("Failed to fetch detailed ERC-20 token data:", error);
    return [];
  }
};
