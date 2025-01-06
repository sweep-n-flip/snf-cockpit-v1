import { Button } from '@/lib/ui/components'

export type BackProps = {
  label: string
  onBack: () => void
  loading?: boolean
  disabled?: boolean
}

export const Back = ({ label, onBack, loading, disabled }: BackProps) => {
  return (
    <Button.Default
      size="sm"
      type="button"
      onClick={onBack}
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
