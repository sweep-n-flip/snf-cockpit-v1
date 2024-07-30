import { BridgeWidgets } from '@/lib/payloadcms/types/payload-types'
import { Card, Typography } from '@/lib/ui/components'

export type WidgetProps = {
  widget?: (string | null) | BridgeWidgets
}

export const Widget = ({ widget }: WidgetProps) => {
  console.log(widget)
  return (
    <Card.Default className="flex w-full flex-col gap-4 lg:max-w-[30rem]">
      <div>
        <Typography.Heading as="h3" size="h4" className="flex items-center justify-between gap-8">
          <Typography.Paragraph size="default" variant="default">
            Bridge
          </Typography.Paragraph>
        </Typography.Heading>
        <Typography.Paragraph>Send NFTs across chains</Typography.Paragraph>
      </div>
    </Card.Default>
  )
}

export default Widget
