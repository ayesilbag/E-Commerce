import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="top-center"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        duration: 1000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-0 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-gray-600 group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-purple-default group-[.toast]:text-white group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700",
          success:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-green-50 group-[.toaster]:to-emerald-50 group-[.toaster]:border-l-4 group-[.toaster]:border-green-500",
          error:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-red-50 group-[.toaster]:to-rose-50 group-[.toaster]:border-l-4 group-[.toaster]:border-red-500",
          warning:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-yellow-50 group-[.toaster]:to-amber-50 group-[.toaster]:border-l-4 group-[.toaster]:border-yellow-500",
          info:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50 group-[.toaster]:to-cyan-50 group-[.toaster]:border-l-4 group-[.toaster]:border-blue-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
