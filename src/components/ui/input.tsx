import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-glass
      className={cn(
        "w-full min-w-0 flex bg-[hsl(var(--bg-glass)/0.6)] border border-[hsl(var(--stroke-default))] text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] px-4 py-3 h-12 rounded-[var(--radius-input)] backdrop-blur-sm focus:ring-1 focus:ring-[hsl(var(--accent)/0.4)] focus:border-[hsl(var(--stroke-accent))] transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none shadow-rim",
        className
      )}
      {...props}
    />
  )
}

export { Input }
