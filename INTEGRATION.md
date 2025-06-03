# Backend-v3 + Cockpit-v1 Direct Integration
Esta documentação descreve a integração **direta** entre o `snf-backend-v3` e o `snf-cockpit-v1`, onde ambos compartilham a mesma base de dados MongoDB como fonte única da verdade.

## Arquitetura Simplificada

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  snf-backend-v3 │    │  snf-cockpit-v1 │    │   Frontend App  │
│                 │    │                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│    │  ┌─────────────┐│
│  │ Cron Jobs   ││    │  │ PayloadCMS  ││    │  │ React/Next  ││
│  │ Data Sync   ││    │  │ Admin UI    ││    │  │ Application ││
│  │ Multi-Chain ││    │  │ Content Mgmt││    │  │             ││
│  └─────────────┘│    │  └─────────────┘│    │  └─────────────┘│
│         │       │    │         │       │    │         │       │
│         ▼       │    │         │       │    │         ▼       │
│  ┌─────────────┐│◄──►│  ┌─────────────┐│◄──►│  ┌─────────────┐│
│  │  MongoDB    ││    │  │ REST API    ││    │  │ HTTP Client ││
│  │ Single Truth││    │  │ Endpoints   ││    │  │ Requests    ││
│  └─────────────┘│    │  └─────────────┘│    │  └─────────────┘│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Princípios da Arquitetura

### 🎯 **Single Database Architecture**
- **Backend-v3**: Escreve dados no DATABASE_URI via cron jobs
- **DATABASE_URI**: Fonte única da verdade unificada
- **MongoDB snf**: Banco consolidado para todos os dados
- **PayloadCMS**: Gerencia collections através de plugin SNF

### 🚀 **Arquitetura Simplificada**
- Plugin SNF gerencia as 4 collections principais
- REST API conecta diretamente ao DATABASE_URI
- PayloadCMS gerencia apenas users/admin e outros dados
- Dados em tempo real, sem latência de sincronização

## Collections MongoDB Compartilhadas

### Backend-v3 ➡️ Cockpit (Leitura Direta)

| Collection | Backend-v3 (Escreve) | Cockpit (Lê,edita ou escreve via PayloadCMS) |
|------------|----------------------|------------------------------|
| `chains` | ✅ Cron sync multi-chain | ✅ PayloadCMS collection |
| `pools` | ✅ AMM data aggregation | ✅ PayloadCMS collection |
| `collections` | ✅ NFT metadata sync | ✅ PayloadCMS collection |
| `tokens` | ✅ Token data sync | ✅ PayloadCMS collection |
| `blockexplorers`| | PayloadCMS Manual |
| `contracts`| | PayloadCMS Manual |
| `globals`| | PayloadCMS Manual |
| `marketplaces` | | PayloadCMS Manual |
| `media` | | PayloadCMS Manual |
| `rpcs` | | PayloadCMS Manual |
| `users` | | PayloadCMS Manual |

### Plugin SNF Collections

O plugin SNF gerencia as 4 collections principais com total integração PayloadCMS:

### Chains
```typescript
// Schema completo migrado e funcionando
{
  chainId: number (unique, indexed)
  name: string
  isTestnet: boolean
  network: {
    token: {
      address: string
      wrappedAddress: string
      decimals: number
      symbol: string
    }
  }
  rpcAddress: string
  stablecoinAddress: string
}
```

### Pools
```typescript
// Schema espelha backend-v3/src/database/schemas/pool.schema.ts
{
  poolId: string (unique)
  chainId: number (direto, indexado)
  name: string
  poolStats: {
    nftPrice: number
    liquidity: number
    apr: number
    volume24h: number
    // ...
  }
  token0: { address, symbol, decimals }
  token1: { address, symbol, decimals }
}
```

### Collections & Tokens
- Schemas idênticos ao backend-v3
- Relacionamentos usando `chainId` numérico direto
- Sem duplicação de estruturas

## REST API Endpoints ✅
### Chains API
```bash
GET /api/chains

### Pools API  
```bash
GET /api/pools

### Collections API
```bash
GET /api/collections  

### Tokens API
```bash
GET /api/tokens


## Setup e Configuração ✅

### 1. Variáveis de Ambiente (Configurado)

```env
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/snf?retryWrites=true&w=majority
PAYLOAD_SECRET=your-secret-key
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_***


```

### 2. Instalação

```bash
cd snf-cockpit-v1
pnpm install
```

### 3. Execução Atual ✅

```bash
# ✅ Servidor rodando na porta 3001
pnpm run dev

# ✅ Admin PayloadCMS: http://localhost:3001/admin
# ✅ API funcionando: http://localhost:3001/api/*
```

## Fluxo de Dados em Tempo Real

```
1. Backend-v3 cron jobs → MongoDB collections
                              ↓
2. PayloadCMS lê diretamente ← MongoDB collections  
                              ↓
3. REST API serve dados ← PayloadCMS
                              ↓
4. Frontend consome ← REST API
```

## Vantagens da Arquitetura Direta

### ✅ **Performance**
- Zero latência de sync
- Dados sempre atualizados
- Menos overhead de processamento

### ✅ **Simplicidade**
- Apenas uma fonte de dados
- Menos moving parts
- Setup mais simples

### ✅ **Consistência**
- Impossível ter dados desatualizados
- Schema sempre consistente
- Relacionamentos preservados

### ✅ **Manutenibilidade**
- Menos código para manter
- Debugging simplificado
- Menos pontos de falha

## Funcionalidades

### Admin Interface (PayloadCMS)
- CRUD completo para todas as entities
- Interface visual para gerenciar dados
- Upload de mídia integrado
- Busca e filtros avançados

### REST API
- Endpoints padronizados RESTful
- Paginação automática
- Filtros por chain, status, etc.
- Response format consistente

### React Hooks
```typescript
// Hooks prontos para frontend
import { usePools, useChains } from '@/lib/services/rest/hooks'

const { data: pools } = usePools({ chainId: 1, limit: 10 })
const { data: chains } = useChains({ isTestnet: false })
```

## Exemplo de Uso

### Buscar Pools por Chain
```bash
curl "http://localhost:3000/api/pools?chainId=1&sortBy=poolStats.liquidity&sortOrder=desc&limit=5"
```

### Buscar NFT Collections Verificadas
```bash
curl "http://localhost:3000/api/collections?verified=true&chainId=1"
```

### Buscar Tokens ERC20
```bash
curl "http://localhost:3000/api/tokens?isErc20=true&chainId=1"
```

## Estrutura Final

```
snf-cockpit-v1/
├── src/
│   ├── app/
│   │   ├── api/             # REST endpoints (leem PayloadCMS)
│   │   │   ├── chains/route.ts   
│   │   │   ├── pools/route.ts     
│   │   │   ├── collections/route.ts
│   │   │   └── tokens/route.ts    
│   │   ├── bridge/               
│   │   └── (payload)/admin/       
│   ├── lib/
│   │   ├── payloadcms/
│   │   │   ├── plugins/snf/        
│   │   │   │   ├── index.ts        
│   │   │   │   └── collections/    
│   │   │   └── collections/        
│   │   └── services/
│   │       └── data-db/connection.ts 
│   └── payload.config.ts          unificada
├── scripts/
│   ├── migrate-users.ts            
│   ├── migrate-collections.ts     
│   └── check-collections.ts       
└── INTEGRATION.md                  
```

## Monitoring & Debug

### Logs
- Backend-v3: Logs de cron jobs e sync
- Cockpit: Logs de API requests
- PayloadCMS: Admin interface para visualizar dados

### Métricas
- API response times via PayloadCMS
- Collection counts e estatísticas
- Error tracking integrado

## Considerações Importantes

### ⚠️ **Responsabilidades**
- **Backend-v3**: Owner dos dados (CREATE, UPDATE, DELETE via jobs)
- **Cockpit**: Reader e servidor de API (READ principalmente)
- **Admin changes**: Cuidado ao editar via PayloadCMS admin

### 🔒 **Backup & Recovery**
- Backup apenas do MongoDB (single source)
- Recovery automático via cron jobs do backend-v3

### 📈 **Escalabilidade**
- MongoDB indexing otimizado
- PayloadCMS pagination automática
- Rate limiting nos endpoints se necessário

## Próximos Passos

1. **Cache Layer**: Redis para queries frequentes
2. **Real-time Updates**: WebSockets para updates live
3. **Analytics**: Dashboard de métricas e uso
4. **Multi-tenant**: Support para múltiplos projetos
5. **GraphQL**: Complementar REST com GraphQL se necessário

---

**Resultado**: Arquitetura simples, performante e sem duplicação de dados! 🎉