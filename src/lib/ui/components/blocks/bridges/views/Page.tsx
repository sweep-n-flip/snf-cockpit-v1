import { Widget } from '@/lib/ui/components/blocks/bridges/Widget'

export default async function Page() {
  return (
    <div className="flex size-full items-center justify-center py-16 container max-lg:items-start">
      <Widget.Widget
        enabledChainIds={[421614, 97, 43114]}
      />
    </div>
  )
}
