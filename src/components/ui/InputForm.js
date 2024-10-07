import React, { useState, useRef, useEffect } from "react";

var classnames = require("classnames");

function InputForm({
  name,
  value,
  onChange,
  symbol,
  styleclass = "input",
  placeholder = "",
  type = "text",
  validationFunc = (value) => true, // Default validation function
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
    <div className="custom-input d-flex flex-row">
      {image && (
        <div className="input-image d-flex justify-content-center align-items-center">
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
        className={classnames(styleclass, error && isTouched ? "error" : "")}
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
      {symbol && (
        <span className="input-symbol d-flex justify-content-center align-items-center">
          {symbol}
        </span>
      )}
    </div>
  );
}
//{error && isTouched && <div className="error-message">{error}</div>}
export default InputForm;
