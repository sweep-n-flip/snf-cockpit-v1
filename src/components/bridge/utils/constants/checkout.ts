import { BridgeStep } from '@/lib/ui/components/blocks/bridges/types/bridge'

export const STEPS_DATA = [
  {
    label: 'Review',
    step: BridgeStep.Details,
  },
  {
    label: 'Approve tokens',
    step: BridgeStep.Approve,
  },
  {
    label: 'Execute bridge',
    step: BridgeStep.Bridge,
  },
  {
    label: 'Tokens has been received',
    step: BridgeStep.Success,
  },
]

export const TOTAL_STEPS = STEPS_DATA.length
