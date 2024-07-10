import { addressUtils } from '@/lib/utils/address'
import { Typography } from '@/lib/ui/components'
import classNames from 'classnames'
import { useWallet } from '@/lib/web3/hooks'
import { Avatar } from '@/lib/web3/components/wallet/account/Avatar'
import { useModal } from 'connectkit'

export const Bar = () => {
  const { address, ens } = useWallet()
  const { setOpen } = useModal()

  return (
    <button className="flex items-center space-x-2" type="button" onClick={() => setOpen(true)}>
      <Avatar size={24} />
      <div
        className={classNames([
          'border border-zinc-300 bg-transparent',
          'hidden rounded-2xl px-2 py-px lg:block',
        ])}
      >
        <Typography.Paragraph size="base" variant="default" className="font-bold text-zinc-700">
          {addressUtils.toEllipsis(ens || address, 4, 4)}
        </Typography.Paragraph>
      </div>
    </button>
  )
}
export default Bar
