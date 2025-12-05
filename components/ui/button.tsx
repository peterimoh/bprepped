import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:shadow-lg hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0',
        destructive:
          'bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
        outline:
          'border-2 border-border bg-background/80 backdrop-blur-sm shadow-sm hover:bg-muted/50 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'bg-gradient-to-r from-secondary to-muted text-secondary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
        ghost:
          'hover:bg-muted/50 hover:text-foreground hover:shadow-sm rounded-xl transition-all duration-300',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors duration-300',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-9 rounded-lg px-4',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
