import { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql'

// Tipo para token (ERC20 ou nativo)
export const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    symbol: { type: GraphQLString },
    decimals: { type: GraphQLString },
    isErc20: { type: GraphQLBoolean },
    isCollection: { type: GraphQLBoolean },
    wrapper: { 
      type: new GraphQLObjectType({
        name: 'TokenWrapper',
        fields: {
          id: { type: GraphQLString },
          name: { type: GraphQLString },
          symbol: { type: GraphQLString },
          decimals: { type: GraphQLString },
          isErc20: { type: GraphQLBoolean },
          isCollection: { type: GraphQLBoolean }
        }
      }),
      resolve: (parent) => parent.wrapper || null
    }
  }
})

// Tipo para pool de liquidez
export const TopPoolType = new GraphQLObjectType({
  name: 'TopPool',
  fields: {
    id: { type: GraphQLString },
    chainId: { type: GraphQLInt },
    name: { type: GraphQLString },
    nftPrice: { type: GraphQLString },
    nftListings: { type: GraphQLString },
    offers: { type: GraphQLString },
    apr: { type: GraphQLString },
    totalVolume: { type: GraphQLString },
    liquidity: { type: GraphQLString },
    erc20Token: { type: TokenType },
    collectionToken: { type: TokenType }
  }
}) 