import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  floating?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, floating = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue)
    }, [props.value, props.defaultValue])

    if (floating && label) {
      return (
        <div className="floating-label">
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-lg border border-border bg-input px-3 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
              "hover:border-primary/50",
              isFocused && "border-primary shadow-glow",
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              setHasValue(!!e.target.value)
              props.onBlur?.(e)
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value)
              props.onChange?.(e)
            }}
            placeholder=" "
            {...props}
          />
          <label 
            className={cn(
              "transition-all duration-300 text-muted-foreground",
              (isFocused || hasValue) && "text-primary text-xs"
            )}
          >
            {label}
          </label>
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
          "hover:border-primary/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }