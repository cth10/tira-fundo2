import React from 'react';
import { Spinner } from './Spinner'; // Assuming Spinner.tsx exists

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'tertiary';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = "font-semibold py-2.5 px-5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out flex items-center justify-center text-sm sm:text-base";
  
  let variantStyles = '';
  switch (variant) {
    case 'secondary':
      variantStyles = "bg-slate-600 hover:bg-slate-500 text-slate-100 focus:ring-slate-400";
      break;
    case 'danger':
      variantStyles = "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";
      break;
    case 'tertiary':
      variantStyles = "bg-transparent hover:bg-slate-700 text-slate-300 hover:text-slate-100 focus:ring-slate-500 border border-slate-600";
      break;
    case 'primary':
    default:
      variantStyles = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white focus:ring-indigo-400";
      break;
  }

  const disabledStyles = "opacity-60 cursor-not-allowed";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${disabled || isLoading ? disabledStyles : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Spinner className="w-5 h-5 mr-2" />
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
};
