import clsx from 'clsx'

type CheckboxProperties = {
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
}

const Checkbox: React.FC<CheckboxProperties> = ({
  checked,
  disabled = false,
  onChange,
  label,
  className,
}) => {
  return (
    <label
      className={clsx(
        className,
        disabled && 'cursor-not-allowed opacity-40',
        !disabled && 'cursor-pointer',
        'inline-flex items-center gap-2',
      )}
    >
      <input
        checked={checked}
        className={clsx(
          'size-4',
          'rounded',
          'border',
          'border-[#C1BFBF] dark:border-[#56555C]',
          'bg-white dark:bg-[#56555C]',
          'checked:bg-blue-500 dark:checked:bg-blue-400',
          'checked:border-blue-500 dark:checked:border-blue-400',
          'focus:ring-2 focus:ring-blue-500/20',
          'focus:outline-none',
          !disabled && 'hover:border-blue-400 dark:hover:border-blue-300',
          disabled && 'cursor-not-allowed',
        )}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="select-none text-sm text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </label>
  )
}

export default Checkbox