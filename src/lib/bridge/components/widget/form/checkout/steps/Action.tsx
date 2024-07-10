import { Button } from '@/lib/ui/components'

export type ActionProps = {
  label: string
  onConfirm: () => void
  loading?: boolean
  disabled?: boolean
}

export const Action = ({ label, onConfirm, loading, disabled }: ActionProps) => {
  return (
    <Button.Default
      size="sm"
      type="button"
      onClick={onConfirm}
      disabled={disabled}
      loading={loading}
      fullWidth={false}
    >
      {label}
    </Button.Default>
  )
}

export default Action
