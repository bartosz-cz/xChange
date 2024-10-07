import { useContext } from "react";
import CryptoContext from "../contexts/CryptoContext";

const useCrypto = () => useContext(CryptoContext);

export default useCrypto;
