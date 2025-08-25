// src/components/ui/radio-group.tsx
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

export const RadioGroup = RadioGroupPrimitive.Root;

export const RadioGroupItem = React.forwardRef<
   React.ElementRef<typeof RadioGroupPrimitive.Item>,
   React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
   <RadioGroupPrimitive.Item ref={ref} className={className} {...props}>
      <RadioGroupPrimitive.Indicator />
      {children}
   </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";
