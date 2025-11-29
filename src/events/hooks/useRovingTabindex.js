import { useState, useRef, useEffect, useCallback } from "react";

// Roving Tabindex Hook (P3.5)
export function useRovingTabindex(itemCount, options = {}) {
  const { orientation = "vertical", loop = true, onSelect } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);

  const handleKeyDown = useCallback((e) => {
    const isVertical = orientation === "vertical";
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight";

    let newIndex = activeIndex;

    if (e.key === prevKey) {
      e.preventDefault();
      newIndex = activeIndex - 1;
      if (newIndex < 0) newIndex = loop ? itemCount - 1 : 0;
    } else if (e.key === nextKey) {
      e.preventDefault();
      newIndex = activeIndex + 1;
      if (newIndex >= itemCount) newIndex = loop ? 0 : itemCount - 1;
    } else if (e.key === "Home") {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      newIndex = itemCount - 1;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(activeIndex);
      return;
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, itemCount, loop, orientation, onSelect]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const getItemProps = useCallback((index) => ({
    ref: (el) => { itemRefs.current[index] = el; },
    tabIndex: index === activeIndex ? 0 : -1,
    onKeyDown: handleKeyDown,
    onFocus: () => setActiveIndex(index),
    "aria-selected": index === activeIndex,
  }), [activeIndex, handleKeyDown]);

  return { activeIndex, setActiveIndex, getItemProps };
}
