/** Viewport coordinates for the caret in a textarea. */
export function getTextareaCaretViewportCoords(
  textarea: HTMLTextAreaElement,
  position: number
): { top: number; left: number } {
  const style = window.getComputedStyle(textarea)
  const mirror = document.createElement("div")
  const props = [
    "boxSizing",
    "width",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "letterSpacing",
    "textTransform",
    "textIndent",
    "whiteSpace",
    "wordBreak",
    "wordSpacing",
    "tabSize",
  ] as const

  const rect = textarea.getBoundingClientRect()
  mirror.style.position = "fixed"
  mirror.style.top = `${rect.top}px`
  mirror.style.left = `${rect.left}px`
  mirror.style.width = `${rect.width}px`
  mirror.style.height = `${rect.height}px`
  mirror.style.overflow = "hidden"
  mirror.style.visibility = "hidden"
  mirror.style.whiteSpace = "pre-wrap"
  mirror.style.wordWrap = "break-word"
  mirror.style.zIndex = "-1"

  for (const prop of props) {
    mirror.style[prop] = style[prop]
  }

  const value = textarea.value
  const before = value.slice(0, position)
  const after = value.slice(position) || "."

  mirror.textContent = before
  const marker = document.createElement("span")
  marker.textContent = after[0] === "\n" ? " " : after[0]
  mirror.appendChild(marker)

  document.body.appendChild(mirror)
  const markerRect = marker.getBoundingClientRect()
  document.body.removeChild(mirror)

  return {
    top: markerRect.top + markerRect.height,
    left: markerRect.left,
  }
}
