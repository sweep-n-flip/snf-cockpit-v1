import { BridgeWidgets, Chains } from '@/lib/payloadcms/types/payload-types'
import { Card, Typography } from '@/lib/ui/components'
import Form from '@/lib/ui/components/blocks/bridges/form/Form'
import { useMemo } from 'react'

export type WidgetProps = {
  widget?: (string | null) | BridgeWidgets
}

export const Widget = ({ widget }: WidgetProps) => {
  const { title, description, setup, routing } = (widget || {}) as Partial<BridgeWidgets>

  // Get the source and target chains
  const { sourceChains, targetChains } = useMemo(() => {
    // Map the chains from the paths
    const sourceChains = routing?.paths.map((path) => {
      return path.sourceChain as Chains
    })

    const targetChains = routing?.paths.map((path) => {
      return path.targetChain as Chains
    })

    return {
      sourceChains: sourceChains ?? [],
      targetChains: targetChains ?? [],
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

            <Form sourceChains={sourceChains} targetChains={targetChains} />
          </div>
        </Card.Default>

        <div className="text-center">
          {setup?.version && (
            <Typography.Paragraph size="xs" className="text-gray-400">
              widget version {setup?.version}
            </Typography.Paragraph>
          )}
        </div>
      </div>
    </div>
  )
}

export default Widget
