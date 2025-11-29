import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass';
}

const Card = ({ children, variant = 'default', className, ...props }: CardProps) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';
  
  const variants = {
    default: 'bg-gray-800 border border-gray-700/50 shadow-lg',
    glass: 'bg-gray-800/40 backdrop-blur-md border border-gray-700/30 shadow-lg',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

export default Card;

