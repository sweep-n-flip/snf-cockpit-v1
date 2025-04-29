import { Logger } from '@/lib/services/logger'
import mongoose, { Document, Schema } from 'mongoose'

const logger = new Logger('TopPoolModel')

// Criar uma conexão separada para o banco de dados de dados
if (!process.env.DATABASE_DATA_URI) {
  logger.error('DATABASE_DATA_URI não está definida')
  throw new Error('DATABASE_DATA_URI não está definida')
}

logger.info('Tentando conectar ao banco de dados de dados...')
const dataConnection = mongoose.createConnection(process.env.DATABASE_DATA_URI, {
  dbName: 'snf',
})

dataConnection.on('connected', () => {
  logger.info('Conectado ao banco de dados de dados (snf)')
})

dataConnection.on('error', (err) => {
  logger.error(`Erro na conexão com o banco de dados de dados: ${err}`)
})

dataConnection.on('disconnected', () => {
  logger.warn('Desconectado do banco de dados de dados')
})

// Definição do tipo de wrapper token
interface TokenWrapper {
  id: string
  name: string
  symbol: string
  isErc20: boolean
  isCollection: boolean
}

// Definição do tipo de token (que pode ter um wrapper)
interface Token {
  id: string
  name: string
  symbol: string
  isErc20: boolean
  isCollection: boolean
  wrapper?: TokenWrapper
}

// Interface para o documento TopPool
export interface TopPoolDocument extends Document {
  poolId: string
  chainId: number
  name: string
  nftPrice: string
  nftListings: string
  offers: string
  apr: string
  totalVolume: string
  liquidity: string
  erc20Token: Token
  collectionToken: Token
  updatedAt: Date
}

// Schema do wrapper token
const TokenWrapperSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    isErc20: { type: Boolean, required: true },
    isCollection: { type: Boolean, required: true },
  },
  { _id: false },
)

// Schema do token
const TokenSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: false }, // Opcional para collectionToken
    isErc20: { type: Boolean, required: true },
    isCollection: { type: Boolean, required: true },
    wrapper: { type: TokenWrapperSchema, required: false }, // Opcional
  },
  { _id: false },
)

// Schema principal do TopPool
const TopPoolSchema = new Schema(
  {
    poolId: { type: String, required: true }, // Renomeado de 'id' para evitar conflito com o _id do MongoDB
    chainId: { type: Number, required: true },
    name: { type: String, required: true },
    nftPrice: { type: Number, required: true },
    nftListings: { type: String, required: true },
    offers: { type: Number, required: true },
    apr: { type: Number, required: true },
    totalVolume: { type: Number, required: true },
    liquidity: { type: Number, required: true },
    erc20Token: { type: TokenSchema, required: true },
    collectionToken: { type: TokenSchema, required: true },
  },
  {
    timestamps: true, // Adiciona campos createdAt e updatedAt
    // Índices para otimizar consultas
    indexes: [
      { fields: { chainId: 1, poolId: 1 }, unique: true },
      { fields: { chainId: 1 } }, // Índice simples para consultas por chainId
      // Índice composto para otimizar o sort
      {
        fields: {
          chainId: 1,
          liquidity: -1,
          apr: -1,
          totalVolume: -1,
        },
      },
    ],
  },
)

// Exporta o modelo TopPool usando a conexão de dados
const TopPoolModel = dataConnection.model<TopPoolDocument>('TopPool', TopPoolSchema, 'toppools')

// Adiciona um método para testar a conexão
export async function testConnection() {
  try {
    await TopPoolModel.findOne()
    logger.info('Conexão com o banco de dados testada com sucesso')
    return true
  } catch (error) {
    logger.error(`Erro ao testar conexão com o banco: ${error}`)
    return false
  }
}

export default TopPoolModel
