"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// ======= BUTTON COMPONENT =======
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "cta"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Base class
    let classes = "btn"

    // Add variant class
    if (variant === "cta") {
      classes += " btn-cta"
    } else if (variant) {
      classes += ` btn-${variant}`
    }

    // Add size class
    if (size !== "default") {
      classes += ` btn-${size}`
    }

    return <Comp className={cn(classes, className)} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

// ======= BADGE COMPONENT =======
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "border-transparent bg-primary text-primary-foreground": variant === "default",
          "border-transparent bg-secondary text-secondary-foreground": variant === "secondary",
          "border-transparent bg-destructive text-destructive-foreground": variant === "destructive",
          "border-border text-foreground": variant === "outline",
        },
        className,
      )}
      {...props}
    />
  )
}

// ======= INPUT COMPONENT =======
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

// ======= DIALOG COMPONENTS =======
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// ======= ERROR DISPLAY COMPONENT =======
export type ErrorSeverity = "info" | "warning" | "error" | "critical"

export interface ErrorDisplayProps {
  title?: string
  message: string
  severity?: ErrorSeverity
  code?: string
  details?: Record<string, any>
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
  compact?: boolean
}

export function ErrorDisplay({
  title,
  message,
  severity = "error",
  code,
  details,
  onRetry,
  onDismiss,
  className,
  compact = false,
}: ErrorDisplayProps) {
  // Determine icon based on severity
  const Icon = () => {
    switch (severity) {
      case "info":
        return <div className="h-5 w-5 text-blue-500">ℹ️</div>
      case "warning":
        return <div className="h-5 w-5 text-amber-500">⚠️</div>
      case "critical":
        return <div className="h-5 w-5 text-red-600">❌</div>
      case "error":
      default:
        return <div className="h-5 w-5 text-red-500">⚠️</div>
    }
  }

  // Determine background color based on severity
  const getBgColor = () => {
    switch (severity) {
      case "info":
        return "bg-blue-50 border-blue-200"
      case "warning":
        return "bg-amber-50 border-amber-200"
      case "critical":
        return "bg-red-100 border-red-300"
      case "error":
      default:
        return "bg-red-50 border-red-200"
    }
  }

  // Determine text color based on severity
  const getTextColor = () => {
    switch (severity) {
      case "info":
        return "text-blue-800"
      case "warning":
        return "text-amber-800"
      case "critical":
        return "text-red-900"
      case "error":
      default:
        return "text-red-800"
    }
  }

  if (compact) {
    return (
      <div className={cn("flex items-center px-3 py-2 rounded-md border", getBgColor(), getTextColor(), className)}>
        <Icon />
        <span className="ml-2 text-sm">{message}</span>
        {onDismiss && (
          <button onClick={onDismiss} className="ml-auto p-1 rounded-full hover:bg-white/50" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={cn("rounded-md border p-4", getBgColor(), getTextColor(), className)}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title || getSeverityTitle(severity)}</h3>
          <div className="mt-2 text-sm">
            <p>{message}</p>
            {code && <p className="mt-1 font-mono text-xs opacity-75">Error code: {code}</p>}
          </div>
          {(onRetry || onDismiss) && (
            <div className="mt-4 flex gap-3">
              {onRetry && (
                <Button size="sm" variant="outline" onClick={onRetry} className="flex items-center">
                  <span className="mr-1">↻</span>
                  Try Again
                </Button>
              )}
              {onDismiss && (
                <Button size="sm" variant="ghost" onClick={onDismiss}>
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to get title based on severity
function getSeverityTitle(severity: ErrorSeverity): string {
  switch (severity) {
    case "info":
      return "Information"
    case "warning":
      return "Warning"
    case "critical":
      return "Critical Error"
    case "error":
    default:
      return "Error"
  }
}
