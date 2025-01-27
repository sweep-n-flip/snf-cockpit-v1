import { Bridge as BridgeType } from '@/lib/payloadcms/types/payload-types'
import { Tabs, Typography } from '@/lib/ui/components'

import { Tab } from '@/lib/ui/components/tabs/Default'
import YourAssetsTable from '@/components/bridge/your-assets-table/YourAssetsTable'

export type WidgetProps = {
  config?: (string | null) | BridgeType
}
export const Bridge = () => {
  const tabs: Tab[] = [
    {
      id: 'assets',
      label: 'Your Assets',
      component: <YourAssetsTable />,
    },
    {
      id: 'collections',
      label: 'All Collections Bridged',
      component: <div>collections</div>,
    },
  ]

  return (
    <div className=" flex flex-col gap-6">
      <Typography.Heading as="h1" size="h3">
        <Typography.Paragraph size="default" variant="default">
          Bridge
        </Typography.Paragraph>
      </Typography.Heading>
      <Tabs.Default tabs={tabs} defaultActiveTab="assets" />
    </div>
  )
}

export default Bridge
