import React from "react";

export function LiveRegion({ message, politeness = "polite" }) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      {message}
    </div>
  );
}
