export function isMacPlatform(): boolean {
  return typeof navigator !== "undefined" && /mac/i.test(navigator.platform);
}

/** Label for the command palette shortcut, matching the visitor's keyboard. */
export function getPaletteShortcutLabel(): string {
  return isMacPlatform() ? "⌘K" : "Ctrl K";
}
