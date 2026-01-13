
import  type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional: Only used for Profile/Settings
  error?: string; // Optional: Show validation error
}

export const Input = ({ label, type,className = "", ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 my-3 w-full">
     
      
      <input
        {...props} 
        type={type}       
        className={`w-full bg-secondary border border-border rounded-b-xl px-5 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all ${className}`}
      />
      
      
    </div>
  );
};