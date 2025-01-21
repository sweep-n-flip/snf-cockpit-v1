import { Bridge as BridgeType, Chains } from '@/lib/payloadcms/types/payload-types'
import { Card, Tabs, Typography } from '@/lib/ui/components'
import { useMemo } from 'react'
import Form from '@/components/bridge/form/Form'
import { Tab } from '@/lib/ui/components/tabs/Default'
import YourAssetsTable from '@/components/bridge/your-assets-table/YourTableAssets'

export type WidgetProps = {
  config?: (string | null) | BridgeType
}

export const Bridge = ({ config }: WidgetProps) => {
  const { title, description, routing } = (config || {}) as Partial<BridgeType>

  // Get the source and target chains
  // const { sourceChains, targetChains } = useMemo(() => {
  //   const sourceChains = new Set<string | Chains>()
  //   const targetChains = new Set<string | Chains>()

  //   // Map the chains from the paths
  //   routing?.paths.map((path) => {
  //     sourceChains.add(path.sourceChain)
  //     targetChains.add(path.targetChain)
  //   })

  //   return {
  //     sourceChains: [...sourceChains],
  //     targetChains: [...targetChains],
  //   }
  // }, [routing?.paths])

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

      {/* <Card.Default className="flex w-full flex-col gap-4 lg:max-w-[30rem]">
          <div>
            {title && (
              <Typography.Heading
                as="h3"
                size="h4"
                className="flex items-center justify-between gap-8 "
              >
                <Typography.Paragraph size="default" variant="default">
                  {title}
                </Typography.Paragraph>
              </Typography.Heading>
            )}

            {description && <Typography.Paragraph>{description}</Typography.Paragraph>} 

             <Form sourceChains={sourceChains as Chains[]} targetChains={targetChains as Chains[]} />
          </div>
        </Card.Default> */}
    </div>
  )
}

export default Bridge
