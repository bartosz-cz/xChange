import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import Icons from "./Icon";
import { Overlay } from "react-bootstrap";

function IconButton({
  type = "button",
  name,
  tooltipText = name,
  tooltipActive = true,
  onClick,
  styleClass = "buttonLight",
  activeStyleClass = "buttonActive",
  size = 32,
  visible = true,
  active = false,
  btnWidth = 40,
  btnHeight = 40,
  zIndex = 3,
  borderRadius = "16px",
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(null);
  const target = useRef(null);

  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);
  useEffect(() => {
    handleMouseLeave();
  }, [visible]);
  const handleMouseEnter = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 800);
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    setHoverTimer(null);
    setShowTooltip(false);
  };

  const tooltip = tooltipActive ? (
    ({
      placement: _placement,
      arrowProps: _arrowProps,
      show: _show,
      popper: _popper,
      hasDoneInitialMeasure: _hasDoneInitialMeasure,
      ...props
    }) => (
      <div
        {...props}
        style={{
          ...props.style,
          backgroundColor: "#563964cd",
          position: "fixed",
          margin: "5px 0px 0px 0px",
          padding: "0px 5px 0px 5px",
          color: "#d5b3e5c9",
          backdropFilter: "blur(5px)",
          fontSize: "12px",
          zIndex: 1024,
          borderRadius: 16,
        }}
      >
        {tooltipText}
      </div>
    )
  ) : (
    <div></div>
  );

  return (
    <button
      ref={target}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={classnames("center", active ? activeStyleClass : styleClass, {
        "d-none": !visible,
      })}
      id={name}
      type={type}
      aria-label={`Option for ${name}`}
      style={{
        "--borderRadius": borderRadius,
        "--btnWidth": `${btnWidth}px`,
        "--btnHeight": `${btnHeight}px`,
        "--zIndex": `${zIndex}`,
      }}
    >
      <Icons name={name} size={size} />
      <Overlay target={target.current} show={showTooltip} placement="bottom">
        {tooltip}
      </Overlay>
    </button>
  );
}

export default IconButton;
