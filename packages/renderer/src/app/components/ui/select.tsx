import React from 'react'

type SelectProps = {
  label: string
  options: { value: string; label: string }[]
  value: string | null
  onChange: (value: string) => void
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)
