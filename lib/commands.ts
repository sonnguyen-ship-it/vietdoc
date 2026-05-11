/** execCommand wrappers for the rich-text toolbar (contenteditable). */

export function exec(cmd: string, value?: string): boolean {
  try {
    return document.execCommand(cmd, false, value)
  } catch {
    return false
  }
}

export function bold(): boolean {
  return exec("bold")
}

export function italic(): boolean {
  return exec("italic")
}

export function underline(): boolean {
  return exec("underline")
}

export function justifyLeft(): boolean {
  return exec("justifyLeft")
}

export function justifyCenter(): boolean {
  return exec("justifyCenter")
}

export function justifyRight(): boolean {
  return exec("justifyRight")
}

export function justifyFull(): boolean {
  return exec("justifyFull")
}

export function insertUnorderedList(): boolean {
  return exec("insertUnorderedList")
}

export function insertOrderedList(): boolean {
  return exec("insertOrderedList")
}

export function undo(): boolean {
  return exec("undo")
}

export function redo(): boolean {
  return exec("redo")
}

export function fontName(name: string): boolean {
  return exec("fontName", name)
}

export function fontSize(size: string): boolean {
  return exec("fontSize", size)
}
