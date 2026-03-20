// @ts-nocheck
import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
// @ts-ignore
import { useToast } from "../../hooks/use-toast"

/**
 * Toaster component that renders all active toasts.
 * Using @type {React.FC} to force the compiler to recognize children.
 * @type {React.FC}
 */
export function Toaster() {
  const { toasts } = useToast()

  // Verify that toasts exists and is an array to prevent runtime crashes
  if (!toasts || !Array.isArray(toasts)) return null

  return (
    <ToastProvider>
      {toasts.map(function (toastItem) {
        // Destructure inside the map to avoid "Property does not exist on type {}"
        const { id, title, description, action, ...props } = toastItem

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <
// @ts-ignore
              ToastTitle>{title}</ToastTitle>}
              {description && (
                <
// @ts-ignore
                ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}