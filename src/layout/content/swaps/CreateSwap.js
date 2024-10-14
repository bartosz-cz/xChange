import IconButton from "../../../components/shared/IconButton";
import InputForm from "../../../components/shared/InputForm";
import Icons from "../../../components/shared/Icon";
import React from "react";
import { useState, useEffect } from "react";
import DynamicText from "./DynamicText";
import { v4 as uuidv4 } from "uuid";

var classnames = require("classnames");

export default function CreateSwap({
  token1,
  token2,
  cryptoPrices,
  loadingRef,
  swaps,
  setSwaps,
  setPopUp,
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
    if (formData.price)
      setPopUp({
        visible: true,
        content: (
          <div className="flexColumn center">
            <div className="center">Are you sure to confirm swap?</div>
            <div className="d-flex" style={{ height: 20 }}></div>
            <div className="flexRow" style={{ fontSize: 14, fontWeight: 700 }}>
              <div className="flexRow center">
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
              <div className="flexColumn center">
                <img
                  className={"d-flex"}
                  src={token1.image}
                  alt="Icon"
                  style={{ width: 24 }}
                />
                <div className="d-flex">{token1.symbol.toUpperCase()}</div>
              </div>
              <div className="center">
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
              <div className="flexColumn center" style={{ marginRight: 10 }}>
                <img
                  className={"d-flex"}
                  src={token2.image}
                  alt="Icon"
                  style={{ width: 24 }}
                />
                <div className="d-flex">{token2.symbol.toUpperCase()}</div>
              </div>
              <div className="center">minus operational fees*</div>
            </div>
          </div>
        ),
        handler: handleSwap,
      });
  };

  const handleSwap = () => {
    let activeSwaps = swaps;
    const uniqueId = uuidv4();
    activeSwaps.push(
      <div className="flexRow center swap" id={uniqueId}>
        <div
          className="center input-symbol unselectable"
          style={{ marginLeft: 5 }}
        >
          <img
            className={"d-flex"}
            src={token2.image}
            alt="Icon"
            style={{ width: 20 }}
          />
        </div>
        <div className="center swapData">
          <div className="justify-content-start align-items-center swapText unselectable">
            <DynamicText text={formData.price} />
          </div>
        </div>
        <Icons name={"Swap"} size={32} />
        <div
          className="center input-symbol unselectable"
          style={{ marginLeft: 5 }}
        >
          <img
            className={"d-flex"}
            src={token1.image}
            alt="Icon"
            style={{ width: 20 }}
          />
        </div>
        <div className="d-flex swapData justify-content-start align-items-center">
          <div className="d-flex justify-content-start align-items-center swapText unselectable">
            <DynamicText text={formData.amount} />
          </div>
        </div>
        <div className="flexColumn center input-symbol unselectable">
          <Icons
            name={"Rate"}
            size={24}
            style={{
              width: 24,
              marginTop: -5,
            }}
            fill={"#270e35"}
          />
          <img
            src={token2.image}
            alt="Icon"
            style={{ width: 16, marginTop: -5 }}
          />
        </div>
        <div className="d-flex swapData justify-content-start align-items-center ">
          <div className="d-flex justify-content-start align-items-center swapText unselectable ">
            <DynamicText text={formData.rate} />
          </div>
        </div>
        <div className="d-flex flex-fill" />
        <IconButton
          name="Approve"
          tooltipActive={true}
          tooltipText="Accept Swap"
          styleClass="buttonLight"
          activeStyleClass="buttonActive"
          btnWidth={50}
          onClick={() =>
            handleRemove(formData.amount, formData.price, uniqueId)
          }
          size={32}
        />
        <div style={{ width: 5 }} />
      </div>
    );
    setSwaps([...activeSwaps]);
  };

  const handleRemove = (price, amount, id) => {
    if (price)
      setPopUp({
        visible: true,
        content: (
          <div className="flexColumn center unselectable ">
            <div className="center unselectable">
              Are you sure to confirm swap?
            </div>
            <div className="d-flex" style={{ height: 20 }} />
            <div className="flexRow" style={{ fontSize: 14, fontWeight: 700 }}>
              <div className="flexRow center">
                <div className="d-flex unselectable">You will pay</div>
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
              <div className="flexColumn center unselectable">
                <img
                  className={"d-flex"}
                  src={token1.image}
                  alt="Icon"
                  style={{ width: 24 }}
                />
                <div className="d-flex unselectable">
                  {token1.symbol.toUpperCase()}
                </div>
              </div>
              <div className="center">
                <div className="d-flex unselectable" style={{ marginLeft: 10 }}>
                  for
                </div>
                <div
                  className="d-flex unselectable"
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
                className="flexColumn center unselectable"
                style={{ marginRight: 10 }}
              >
                <img
                  className={"d-flex"}
                  src={token2.image}
                  alt="Icon"
                  style={{ width: 24 }}
                />
                <div className="d-flex unselectable ">
                  {token2.symbol.toUpperCase()}
                </div>
              </div>
              <div className="center unselectable ">
                minus operational fees*
              </div>
            </div>
          </div>
        ),
        handler: () => RemoveSwap(id),
      });
  };

  const RemoveSwap = (id) => {
    setSwaps((prevSwaps) => [
      ...prevSwaps.filter((swap) => swap.props.id !== id),
    ]);
  };

  return (
    <div className="flexColumn swapCreate">
      <div
        className="center textLight unselectable "
        style={{ "--fontSize": 20 + "px" }}
      >
        Swap
      </div>
      <div style={{ height: 15 }} />
      <form onSubmit={handleSubmit} className={classnames("flexRow", "center")}>
        <InputForm
          name="amount"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleInputChange}
          validationFunc={(value) => !!value.trim()}
          errorMessage="Amount is required"
          image={token1.image}
        />
        <div className="d-flex" style={{ width: 5 }} />
        <Icons name={"Swap"} size={32} />
        <div className="d-flex" style={{ width: 5 }} />
        <InputForm
          name="price"
          placeholder="0.00"
          value={formData.price}
          onChange={handleInputChange}
          validationFunc={(value) => !!value.trim()}
          errorMessage="Price is required"
          image={token2.image}
        />
        <div
          className="flexColumn center input-symbol unselectable"
          style={{ marginLeft: 10 }}
        >
          <Icons
            name={"Rate"}
            size={24}
            style={{
              width: 24,
              marginTop: -5,
            }}
            fill={"#270e35"}
          />
          <img
            src={token2.image}
            alt="Icon"
            style={{ width: 16, marginTop: -5 }}
          />
        </div>
        <InputForm
          name="rate"
          placeholder={0.0}
          value={formData.rate}
          onChange={handleInputChange}
          validationFunc={(value) => !!value.trim()}
          errorMessage="Rate is required"
          borderRadius={"0px"}
        />
        <IconButton
          type="submit"
          name="Approve"
          tooltipText="Approve Swap"
          styleClass="buttonLight"
          borderRadius="0 16px 16px 0"
        />
      </form>
    </div>
  );
}
