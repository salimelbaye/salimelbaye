import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[11px] border border-transparent text-[14.5px] font-medium -tracking-[0.01em] transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[linear-gradient(180deg,#5A85FA,#3A63E8)] text-white shadow-glow hover:-translate-y-px hover:shadow-[0_16px_34px_-14px_rgba(79,125,249,1)]',
        ghost:
          'border-line-strong bg-[rgba(148,163,184,0.06)] text-ink hover:-translate-y-px hover:border-[rgba(148,163,184,0.32)] hover:bg-[rgba(148,163,184,0.11)]',
        link: 'text-ink underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-[38px] rounded-[10px] px-4 text-[13.5px]',
        icon: 'size-[38px] rounded-[10px] px-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
