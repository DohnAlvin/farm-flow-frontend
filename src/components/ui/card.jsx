import * as React from "react";

import { cn } from "../../lib/utils";

const Card = React.forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.Ref<HTMLDivElement>} ref
   */
  ({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-stone-200 bg-white text-stone-950 shadow-sm transition-all duration-200", 
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.Ref<HTMLDivElement>} ref
   */
  ({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLHeadingElement>} props
   * @param {React.Ref<HTMLHeadingElement>} ref
   */
  ({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-bold leading-none tracking-tight text-stone-900", className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLParagraphElement>} props
   * @param {React.Ref<HTMLParagraphElement>} ref
   */
  ({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-stone-500 leading-relaxed", className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.Ref<HTMLDivElement>} ref
   */
  ({ className, children, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} 
    {...props}
  >
    {children}
  </div>
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.Ref<HTMLDivElement>} ref
   */
  ({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-stone-50 mt-4", className)}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };