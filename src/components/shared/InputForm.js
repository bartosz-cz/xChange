import React, { useState, useRef, useEffect } from "react";

var classnames = require("classnames");

function InputForm({
  name,
  value,
  onChange,
  symbol,
  borderRadius = "0 16px 16px 0",
  placeholder = "",
  type = "text",
  validationFunc = (value) => true,
  errorMessage = "Invalid input",
  image,
}) {
  const [isTouched, setIsTouched] = useState(false);
  const [error, setError] = useState("");
  const mirrorSpan = useRef(null);
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const { value } = event.target;
    if (!validationFunc(value)) {
      setError(errorMessage);
    } else {
      setError("");
    }
    onChange(event); // Call the passed onChange handler
    if (mirrorSpan.current) {
      inputRef.current.style.width = `${mirrorSpan.current.offsetWidth + 40}px`;
    }
  };

  useEffect(() => {
    if (mirrorSpan.current) {
      inputRef.current.style.width = `${mirrorSpan.current.offsetWidth + 40}px`;
    }
  }, [value]);

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div className="flexRow">
      {image && (
        <div className="center input-symbol unselectable">
          <img
            className={"d-flex"}
            src={image}
            alt="Icon"
            style={{ width: 20 }}
          />
        </div>
      )}
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        size={value.length || 1}
        className={classnames("textDark", error && isTouched ? "error" : "")}
        style={{ "--borderRadius": borderRadius, "--fontSize": "18px" }}
      />
      <span
        ref={mirrorSpan}
        className="mirror-span"
        aria-hidden="true"
        style={{
          visibility: "hidden",
          position: "absolute",
          whiteSpace: "pre",
        }}
      >
        {value || placeholder}
      </span>
      {symbol && <span className="center input-symbol">{symbol}</span>}
    </div>
  );
}
export default InputForm;
