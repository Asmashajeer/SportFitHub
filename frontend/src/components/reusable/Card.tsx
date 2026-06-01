import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        card-base p-6
        ${hoverable ? 'hover:bg-secondary/60 hover:border-primary/30 cursor-pointer hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
