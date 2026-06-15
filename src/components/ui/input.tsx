import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 flex bg-zinc-900/50 border border-white/10 text-white px-4 py-3 h-12 rounded-xl focus:ring-1 focus:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none",
        className
      )}
      {...props}
    />
  )
}

export { Input }
