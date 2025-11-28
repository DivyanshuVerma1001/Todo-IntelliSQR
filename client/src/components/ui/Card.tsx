import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass';
}

const Card = ({ children, variant = 'default', className, ...props }: CardProps) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';
  
  const variants = {
    default: 'bg-gray-800 border border-gray-700 shadow-xl',
    glass: 'bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 shadow-2xl',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

export default Card;

