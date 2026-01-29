
import  type{ ButtonHTMLAttributes, ReactNode } from 'react';



interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:'primary'|'secondary'|'outline'|'ghost',
  size?:'sm'|'md'|'lg',
  disabled?:boolean,
  isLoading?: boolean,
  children: ReactNode,
}


  

 const Button = ({ 
    variant = 'primary', 
    size='sm',
    disabled,
    isLoading, 
    children, 
    className = "", 
    ...props 
  }: ButtonProps) => {

    const baseStyles ='btn-default';

  const sizeMap={
    sm:'text-sm px-3 py-1.5 ',
    md:'text-md px-4 py-3 ',
    lg:'text-lg px-6 py-3.5 ',
  } as const;
  const variantMap={
    primary:'btn-primary',
    secondary:'btn-secondary',
    outline:'btn-outline',
    ghost:'btn-ghost'
  } as const;

  const disabledStyles='opacity-50 cursur-not-allowed hover:bg-none focus:ring-0'










    const classes = [
      baseStyles,          // Your base CSS class
      variantMap[variant],    // Your specific variant class
      sizeMap[size],
      isLoading&& disabledStyles,          // Optional size scaling
      className               // Custom classes passed via props
    ].join(' ');
  

    return (
      <button 
        className={classes}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            {/* A simple, clean spinner */}
            <div className="h-5 w-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
};
export default Button;