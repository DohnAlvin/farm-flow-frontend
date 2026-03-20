// @ts-nocheck
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-stone-950 group-[.toaster]:border-stone-200 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-stone-500 font-medium",
          actionButton:
            "group-[.toast]:bg-[#1B4332] group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:font-semibold",
          cancelButton:
            "group-[.toast]:bg-stone-100 group-[.toast]:text-stone-600 group-[.toast]:rounded-lg",
        },
      }}
      {...props} 
    />
  )
}

export { Toaster }