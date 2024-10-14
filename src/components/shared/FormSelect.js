import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { Overlay } from "react-bootstrap";

export default function FormSelect({
  selectedToken,
  setSelectedToken,
  selectedToken2,
  visible,
  erc20Tokens,
}) {
  const target = useRef(null);
  const [sortedOptions, setSortedOptions] = useState([]);
  const [optionsShow, setOptionsShow] = useState(false);

  const SelectOptions = ({
    placement: _placement,
    arrowProps: _arrowProps,
    show: _show,
    popper: _popper,
    hasDoneInitialMeasure: _hasDoneInitialMeasure,
    ...props
  }) => (
    <div
      {...props}
      className={classnames("selectOptions custom-scrollbar", {
        "d-none": !visible,
      })}
      style={{
        ...props.style,
      }}
    >
      {sortedOptions}
    </div>
  );
  useEffect(() => {
    let Options = [];
    for (let token of erc20Tokens) {
      if (token.symbol !== selectedToken2.symbol)
        Options.push(
          <div
            className={classnames(
              "d-flex flex-row",
              { selectOption: token.symbol !== selectedToken.symbol },
              { selectedOption: token.symbol === selectedToken.symbol }
            )}
            key={token.symbol}
            value={token.symbol}
            role="button"
            type="button"
            onClick={() => handleSelectionChange(token)}
          >
            <img
              alt={"icon"}
              src={token.image}
              className="d-flex"
              style={{ marginRight: 5 }}
            />
            <div className="d-flex justify-content-center align-items-center">
              {token.symbol.toUpperCase()}
            </div>
          </div>
        );
    }
    setSortedOptions(Options);
  }, [erc20Tokens, selectedToken, selectedToken2]);

  const handleOptionsShow = () => {
    console.log(optionsShow);
    setOptionsShow(!optionsShow);
  };

  const handleSelectionChange = (token) => {
    setSelectedToken(token);
  };

  return (
    <div
      className={"styleClass"}
      onClick={handleOptionsShow}
      type="button"
      role="button"
      ref={target}
    >
      <div className="flexRow selectedOption justify-content-center unselectable">
        <img
          alt={"icon"}
          src={selectedToken.image}
          className="d-flex unselectable"
          style={{ marginRight: 5 }}
        />
        <div className="center unselectable">
          {selectedToken.symbol.toUpperCase()}
        </div>
      </div>
      <Overlay target={target.current} show={optionsShow} placement="bottom">
        {SelectOptions}
      </Overlay>
    </div>
  );
}
