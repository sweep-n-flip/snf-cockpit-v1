import { Pages } from '@/lib/payloadcms/types/payload-types'
import { Children } from 'react'

import { Bridges } from './bridges'

export type BlockProps = {
  layout: Pages['layout']
}

export const Block = ({ layout }: BlockProps) => {
  console.log('layout', layout)
  return Children.toArray(
    layout?.map((layout) => (
      <>{{ bridges: <Bridges.Widget widget={layout.widget} /> }[layout.blockType]}</>
    )),
  )
}

export default Block
