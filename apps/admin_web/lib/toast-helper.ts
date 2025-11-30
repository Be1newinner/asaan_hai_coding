export function showToast(type: "success" | "error" | "info" | "warning", title: string, description?: string) {
  if (typeof window !== "undefined" && (window as any).addToast) {
    ;(window as any).addToast({ type, title, description })
  }
}

export const toast = {
  success: (title: string, description?: string) => showToast("success", title, description),
  error: (title: string, description?: string) => showToast("error", title, description),
  info: (title: string, description?: string) => showToast("info", title, description),
  warning: (title: string, description?: string) => showToast("warning", title, description),
}
