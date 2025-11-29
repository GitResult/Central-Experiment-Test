import { useState } from "react";

// Focus Ring Hook (P3.1)
export function useFocusRing() {
  const [isFocused, setIsFocused] = useState(false);

  const focusProps = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };

  const getFocusStyle = (theme) => isFocused ? {
    outline: "none",
    boxShadow: `0 0 0 3px ${theme.primary}40`,
  } : {
    outline: "none",
  };

  return { isFocused, focusProps, getFocusStyle };
}
