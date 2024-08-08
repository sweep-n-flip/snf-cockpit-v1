import * as chains from './chains'
import * as rpcs from './rpcs'
import * as marketplaces from './marketplaces'
import * as contracts from './contracts'
import * as blockExplorers from './blockExplorers'

export const networks = {
  ...chains,
  ...rpcs,
  ...marketplaces,
  ...contracts,
  ...blockExplorers,
}

export default networks
