import { Bridge as BridgeType, Chains } from '@/lib/payloadcms/types/payload-types'
import { Card, Typography } from '@/lib/ui/components'
import Form from '@/lib/ui/components/blocks/bridges/form/Form'
import { useMemo } from 'react'

export type WidgetProps = {
  config?: (string | null) | BridgeType
}

export const Bridge = ({ config }: WidgetProps) => {
  const { title, description, routing } = (config || {}) as Partial<BridgeType>

  // Get the source and target chains
  const { sourceChains, targetChains } = useMemo(() => {
    const sourceChains = new Set<string | Chains>()
    const targetChains = new Set<string | Chains>()

    // Map the chains from the paths
    routing?.paths.map((path) => {
      sourceChains.add(path.sourceChain)
      targetChains.add(path.targetChain)
    })

    return {
      sourceChains: [...sourceChains],
      targetChains: [...targetChains],
    }
  }, [routing?.paths])

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col gap-2">
        <Card.Default className="flex w-full flex-col gap-4 lg:max-w-[30rem]">
          <div>
            {title && (
              <Typography.Heading
                as="h3"
                size="h4"
                className="flex items-center justify-between gap-8"
              >
                <Typography.Paragraph size="default" variant="default">
                  {title}
                </Typography.Paragraph>
              </Typography.Heading>
            )}

            {description && <Typography.Paragraph>{description}</Typography.Paragraph>}

            <Form sourceChains={sourceChains as Chains[]} targetChains={targetChains as Chains[]} />
          </div>
        </Card.Default>
      </div>
    </div>
  )
}

export default Bridge
