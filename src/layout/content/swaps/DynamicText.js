import React, { useState, useEffect, useRef } from "react";

function DynamicText({ text }) {
  const parentRef = useRef(null);
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const adjustText = () => {
      if (parentRef.current) {
        const containerWidth = parentRef.current.offsetWidth;
        const context = document.createElement("canvas").getContext("2d");
        context.font = "18px Century Gothic"; // Ensure this matches your CSS

        let maxLength = text.length;
        let cutText = text;
        let textWidth = context.measureText(cutText).width;

        while (textWidth > containerWidth && maxLength > 0) {
          maxLength--;
          cutText = text.substring(0, maxLength);
          textWidth = context.measureText(cutText).width;
        }

        setDisplayText(cutText);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      adjustText();
    });

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => {
      if (parentRef.current) {
        resizeObserver.unobserve(parentRef.current);
      }
    };
  }, [text]);

  return (
    <div ref={parentRef} style={{ width: "100%", overflow: "hidden" }}>
      {displayText}
    </div>
  );
}

export default DynamicText;
