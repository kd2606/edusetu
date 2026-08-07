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
        "w-full min-w-0 flex bg-surface border border-outline-variant text-on-surface placeholder:text-on-surface-muted px-4 py-3 h-12 rounded-[var(--radius-input)] focus:ring-1 focus:ring-primary focus:border-outline-variant transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none hover:bg-surface-high focus:shadow-e2",
        className
      )}
      {...props}
    />
  )
}

export { Input }
