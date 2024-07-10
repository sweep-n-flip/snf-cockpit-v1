import { Button } from '@/lib/ui/components'
import { useModal } from 'connectkit'
import { ButtonHTMLAttributes } from 'react'

export type ConnectProps = ButtonHTMLAttributes<HTMLButtonElement> & {}

export const Connect = ({ ...props }: ConnectProps) => {
  const { setOpen } = useModal()
  return (
    <Button.Default {...props} size="xs" type="button" onClick={() => setOpen(true)}>
      Connect
    </Button.Default>
  )
}

export default Connect
