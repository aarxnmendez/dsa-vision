export type PanelSide = "left" | "right";

export function getPanelShellTransform(side: PanelSide, isOpen: boolean): string {
  if (isOpen) {
    return "translateX(0)";
  }

  return side === "left" ? "translateX(-100%)" : "translateX(100%)";
}

function getToggleAnchorClasses(side: PanelSide, isOpen: boolean): string {
  const motion = "transition-transform duration-300 ease-in-out";

  if (side === "left") {
    return isOpen
      ? `absolute top-3 right-0 translate-x-1/2 z-50 pointer-events-auto ${motion}`
      : `absolute top-3 right-0 translate-x-full z-50 pointer-events-auto ${motion}`;
  }

  return isOpen
    ? `absolute top-3 left-0 -translate-x-1/2 z-50 pointer-events-auto ${motion}`
    : `absolute top-3 left-0 -translate-x-full z-50 pointer-events-auto ${motion}`;
}

export function getToggleShapeClasses(side: PanelSide, isOpen: boolean): string {
  if (isOpen) {
    return "rounded-xl";
  }

  return side === "left" ? "rounded-l-none rounded-r-xl" : "rounded-r-none rounded-l-xl";
}

export { getToggleAnchorClasses };
