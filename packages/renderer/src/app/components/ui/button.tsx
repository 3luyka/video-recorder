import React from 'react'
import { cn } from '../../utils/cn'

type Color = 'primary' | 'secondary' | 'danger' | 'success'

type Size = 'md'

interface ButtonProps {
  onClick: () => void
  disabled?: boolean
  color?: Color
  size?: Size
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
}

const colorStyles: Record<Color, string> = {
  primary:
    'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
  secondary: 'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
  danger: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
  success:
    'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
}

const sizeStyles: Record<Size, string> = {
  md: 'px-6 py-3',
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  color = 'primary',
  size = 'md',
  icon,
  className,
  children,
}) => {
  return (
    <button
      {...{ onClick, disabled }}
      className={cn(
        'inline-flex cursor-pointer items-center rounded-full font-medium text-white transition-all',
        'bg-gradient-to-r shadow-lg hover:shadow-xl',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
        colorStyles[color],
        sizeStyles[size],
        className
      )}
    >
      {icon ? <span className="mr-2">{icon}</span> : null}
      {children}
    </button>
  )
}
