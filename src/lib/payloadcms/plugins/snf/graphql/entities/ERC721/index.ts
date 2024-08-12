import { ownership } from './ownership'
import { wallet } from './wallet'

export const ERC721 = {
  ownership,
  /**
   * todo: using "wallet" since theres a missing change in the backend structure where
   *
   * ERC721 -> wallet -> balance <- only ERC721 addresses
   * ERC721 -> collection -> metadata <- only ERC721 collection metadata
   * ERC721 -> token -> metadata <- only ERC721 token metadata
   * ERC721 -> ownership -> permission <- only ERC721 ownership permission
   * */
  wallet,
}
