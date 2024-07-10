import { Button } from '@/lib/ui/components'

export type BackProps = {
  label: string
  onBck: () => void
  loading?: boolean
  disabled?: boolean
}

export const Back = ({ label, onBck, loading, disabled }: BackProps) => {
  return (
    <Button.Default
      size="sm"
      type="button"
      onClick={onBck}
      disabled={disabled}
      variant="white"
      loading={loading}
      fullWidth={false}
    >
      {label}
    </Button.Default>
  )
}

export default Back
