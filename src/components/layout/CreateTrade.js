import IconButton from "../ui/IconButton";
import InputForm from "../ui/InputForm";
import Icons from "../ui/Icons";
import React from "react";
import { useState, useEffect } from "react";
import RateIcon from "../icons/Rate.svg";
import DynamicText from "../ui/DynamicText";
import { v4 as uuidv4 } from "uuid";

var classnames = require("classnames");

export default function CreateTrade({
  token1,
  token2,
  cryptoPrices,
  loadingRef,
  swaps,
  setSwaps,
  settings,
  setSettings,
}) {
  const [formData, setFormData] = useState({
    amount: "",
    price: "",
    rate: "",
  });

  useEffect(() => {
    if (
      cryptoPrices.histominute[token2.symbol.toUpperCase()] &&
      cryptoPrices.histominute[token1.symbol.toUpperCase()] &&
      token1.symbol &&
      token2.symbol &&
      !loadingRef.current[token1.symbol.toUpperCase()] &&
      !loadingRef.current[token2.symbol.toUpperCase()]
    ) {
      setFormData({
        ...formData,
        price:
          formData.price !== ""
            ? (
                (cryptoPrices.histominute[token1.symbol.toUpperCase()][
                  cryptoPrices.histominute[token1.symbol.toUpperCase()].length -
                    1
                ][1] *
                  formData.amount) /
                cryptoPrices.histominute[token2.symbol.toUpperCase()][
                  cryptoPrices.histominute[token2.symbol.toUpperCase()].length -
                    1
                ][1]
              ).toFixed(6)
            : "",
        rate: cryptoPrices.histominute[token2.symbol.toUpperCase()][
          cryptoPrices.histominute[token2.symbol.toUpperCase()].length - 1
        ][1],
      });
    }
  }, [token1, token2, cryptoPrices]);

  const handleInputChange = (event) => {
    let dollars1 =
      cryptoPrices.histominute[token1.symbol.toUpperCase()][
        cryptoPrices.histominute[token1.symbol.toUpperCase()].length - 1
      ][1];
    let dollars2 =
      cryptoPrices.histominute[token2.symbol.toUpperCase()][
        cryptoPrices.histominute[token2.symbol.toUpperCase()].length - 1
      ][1];
    const { name, value } = event.target;
    if (/^\d*\.?\d*$/.test(value)) {
      let newFormData = { ...formData, [name]: value };
      switch (name) {
        case "amount":
          if (newFormData.amount !== "") {
            console.log("cew");
            newFormData.price = (
              (parseFloat(value) * dollars1) /
              parseFloat(dollars2)
            ).toFixed(6);
          } else {
            newFormData.price = "";
          }
          break;
        case "price":
          if (newFormData.price !== "") {
            newFormData.amount = (
              (parseFloat(newFormData.price) * dollars2) /
              dollars1
            ).toFixed(6);
            if (newFormData.amount === "0.00") newFormData.amount = "";
          }
          break;
        case "rate":
          if (newFormData.amount && newFormData.rate !== "") {
            console.log("cew");
            newFormData.price = (
              (parseFloat(newFormData.amount) * dollars1) /
              parseFloat(value)
            ).toFixed(6);
            if (newFormData.price === "0.00") newFormData.price = "";
          }
          break;
        default:
          break;
      }
      setFormData(newFormData);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(token1);
    if (formData.price)
      setSettings({
        visible: true,
        content: (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center">
              Are you sure to confirm swap?
            </div>
            <div className="d-flex" style={{ height: 20 }}></div>
            <div
              className="d-flex flex-row"
              style={{ fontSize: 14, fontWeight: 700 }}
            >
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="d-flex">You will pay</div>
                <div
                  className="d-flex"
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    marginLeft: 5,
                    marginRight: 10,
                  }}
                >
                  {formData.amount}
                </div>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <img
                  className={"d-flex"}
                  src={token1.image}
                  alt="Icon"
                  style={{ width: 24 }}
                />
                <div className="d-flex">{token1.symbol.toUpperCase()}</div>
              </div>
              <div className="d-flex  justify-content-center align-items-center">
                <div className="d-flex" style={{ marginLeft: 10 }}>
                  for
                </div>
                <div
                  className="d-flex"
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    marginLeft: 5,
                    marginRight: 10,
                  }}
                >
                  {formData.price}
                </div>
              </div>
              <div
                className="d-flex flex-column  justify-content-center align-items-center"
                style={{ marginRight: 10 }}
              >
                <img
                  className={"d-flex"}
                  src={token2.image}
                  alt="Icon"
                  style={{ width: 24 }}
                />
                <div className="d-flex">{token2.symbol.toUpperCase()}</div>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                minus operational fees*
              </div>
            </div>
          </div>
        ),
        handler: handleSwap,
      });
  };

  const handleSwap = () => {
    const textStyle = {
      width: "100%", // Assuming parent container controls width
      fontFamily: "Century Gothic",
      overflow: "hidden",
      whiteSpace: "nowrap",
    };
    let activeSwaps = swaps;
    const uniqueId = uuidv4();
    activeSwaps.push(
      <div
        className="d-flex flex-row justify-content-center align-items-center swap"
        id={uniqueId}
      >
        <div className="input-image d-flex justify-content-center align-items-center">
          <img
            className={"d-flex"}
            src={token1.image}
            alt="Icon"
            style={{ width: 20 }}
          />
        </div>
        <div className="d-flex swapData justify-content-start align-items-center">
          <div className="d-flex swapDataText justify-content-start align-items-center">
            <DynamicText text={formData.amount} style={textStyle} />
          </div>
        </div>
        <Icons name={"Swap"} size={32} />
        <div className="input-image d-flex justify-content-center align-items-center">
          <img
            className={"d-flex"}
            src={token2.image}
            alt="Icon"
            style={{ width: 20 }}
          />
        </div>
        <div className="d-flex swapData justify-content-start align-items-center">
          <div className="d-flex swapDataText justify-content-start align-items-center">
            <DynamicText text={formData.price} style={textStyle} />
          </div>
        </div>
        <div className="input-image d-flex flex-column justify-content-center align-items-center">
          <img src={RateIcon} alt="Icon" style={{ width: 24, marginTop: -5 }} />
          <img
            src={token2.image}
            alt="Icon"
            style={{ width: 16, marginTop: -5 }}
          />
        </div>
        <div className="d-flex swapData justify-content-start align-items-center ">
          <div className="d-flex swapDataText justify-content-start align-items-center">
            <DynamicText text={formData.rate} style={textStyle} />
          </div>
        </div>
        <div className="d-flex flex-fill"></div>
        <IconButton
          name="Approve"
          tooltipActive={true}
          tooltipText="Accept Swap"
          styleClass="swapConfirm"
          activeStyleClass="buttonActive"
          onClick={() =>
            handleRemove(formData.amount, formData.price, uniqueId)
          }
          size={32}
        />
      </div>
    );
    setSwaps([...activeSwaps]);
    console.log(activeSwaps);
  };

  const handleRemove = (price, amount, id) => {
    console.log(token1);
    if (price)
      setSettings({
        visible: true,
        content: (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center">
              Are you sure to confirm swap?
            </div>
            <div className="d-flex" style={{ height: 20 }}></div>
            <div
              className="d-flex flex-row"
              style={{ fontSize: 14, fontWeight: 700 }}
            >
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="d-flex">You will pay</div>
                <div
                  className="d-flex"
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    marginLeft: 5,
                    marginRight: 10,
                  }}
                >
                  {price}
                </div>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <img
                  className={"d-flex"}
                  src={token1.image}
                  alt="Icon"
                  style={{ width: 24 }}
                />
                <div className="d-flex">{token1.symbol.toUpperCase()}</div>
              </div>
              <div className="d-flex  justify-content-center align-items-center">
                <div className="d-flex" style={{ marginLeft: 10 }}>
                  for
                </div>
                <div
                  className="d-flex"
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    marginLeft: 5,
                    marginRight: 10,
                  }}
                >
                  {amount}
                </div>
              </div>
              <div
                className="d-flex flex-column  justify-content-center align-items-center"
                style={{ marginRight: 10 }}
              >
                <img
                  className={"d-flex"}
                  src={token2.image}
                  alt="Icon"
                  style={{ width: 24 }}
                />
                <div className="d-flex">{token2.symbol.toUpperCase()}</div>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                minus operational fees*
              </div>
            </div>
          </div>
        ),
        handler: () => RemoveSwap(id),
      });
  };

  const RemoveSwap = (id) => {
    console.log(id);
    console.log(swaps);
    setSwaps((prevSwaps) => [
      ...prevSwaps.filter((swap) => swap.props.id !== id),
    ]);
  };

  return (
    <div className="d-flex flex-column tradeCreate customBorder">
      <div className="d-flex justify-content-center align-items-center tradeCreateHeader">
        Swap
      </div>
      <form
        onSubmit={handleSubmit}
        className={classnames(
          "d-flex",
          "flex-row",
          "justify-content-center",
          "align-items-center"
        )}
      >
        <InputForm
          name="amount"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleInputChange}
          validationFunc={(value) => !!value.trim()}
          errorMessage="Amount is required"
          image={token1.image}
        />
        <Icons name={"Swap"} size={32} />
        <InputForm
          name="price"
          placeholder="0.00"
          value={formData.price}
          onChange={handleInputChange}
          validationFunc={(value) => !!value.trim()}
          errorMessage="Price is required"
          image={token2.image}
        />
        <div className="input-image d-flex flex-column justify-content-center align-items-center">
          <img src={RateIcon} alt="Icon" style={{ width: 24, marginTop: -5 }} />
          <img
            src={token2.image}
            alt="Icon"
            style={{ width: 16, marginTop: -5 }}
          />
        </div>
        <InputForm
          styleclass="inputSubmit"
          name="rate"
          placeholder={0.0}
          value={formData.rate}
          onChange={handleInputChange}
          validationFunc={(value) => !!value.trim()}
          errorMessage="Rate is required"
        />
        <IconButton
          type="submit"
          name="Approve"
          tooltipActive={true}
          tooltipText="Approve Swap"
          styleClass="buttonCreate"
          activeStyleClass="buttonActive"
          size={32}
        />
      </form>
    </div>
  );
}
