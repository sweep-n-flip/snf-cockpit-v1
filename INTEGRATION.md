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

## Princípios da Integração

### 🎯 **Dual Database Architecture**
- **Backend-v3**: Escreve dados no DATABASE_DATA_URI via cron jobs
- **DATABASE_DATA_URI**: Fonte única da verdade para dados de negócio
- **DATABASE_URI**: Banco dedicado do PayloadCMS (users, media, admin)
- **Cockpit**: Lê dados de ambos os bancos conforme necessário
- **Frontend**: Consome REST API do cockpit

### 🚀 **Zero Duplicação**
- Não há sync intermediário entre projetos
- REST API conecta diretamente ao DATABASE_DATA_URI
- PayloadCMS gerencia apenas users/admin no DATABASE_URI
- Dados em tempo real, sem latência de sincronização

## Collections MongoDB Compartilhadas

### Backend-v3 ➡️ Cockpit (Leitura Direta)

| Collection | Backend-v3 (Escreve) | Cockpit (Lê via PayloadCMS) |
|------------|----------------------|------------------------------|
| `chains` | ✅ Cron sync multi-chain | ✅ PayloadCMS collection |
| `pools` | ✅ AMM data aggregation | ✅ PayloadCMS collection |
| `collections` | ✅ NFT metadata sync | ✅ PayloadCMS collection |
| `tokens` | ✅ Token data sync | ✅ PayloadCMS collection |

## PayloadCMS Collections

### Chains
```typescript
// Corresponde exatamente ao schema backend-v3
{
  chainId: number (unique)
  name: string
  isTestnet: boolean
  network: json
  // ... todos os campos do backend-v3
}
```

### Pools
```typescript
// Schema espelha backend-v3/src/database/schemas/pool.schema.ts
{
  poolId: string
  chainId: number (direto, não relacionamento)
  name: string
  poolStats: {
    nftPrice: number
    liquidity: number
    apr: number
    // ...
  }
  token0: { ... }
  token1: { ... }
}
```

### Collections & Tokens
- Schemas idênticos ao backend-v3
- Relacionamentos usando `chainId` numérico direto
- Sem duplicação de estruturas

## REST API Endpoints

### Pools
- `GET /api/pools?chainId=1&page=1&limit=10`
- `GET /api/pools?sortBy=poolStats.liquidity&sortOrder=desc`
- `POST /api/pools` (criar via admin)
- `PUT /api/pools/[id]` (editar via admin)

### Chains  
- `GET /api/chains?isTestnet=false`
- `GET /api/chains?page=1&limit=50`

### Collections
- `GET /api/collections?chainId=1&verified=true`
- `GET /api/collections?search=cryptopunks`

### Tokens
- `GET /api/tokens?chainId=1&isErc20=true`

## Setup e Configuração

### 1. Variáveis de Ambiente

```env
# Separação de bancos para responsabilidades distintas
DATABASE_URI=mongodb://localhost:27017/snf-cockpit        # PayloadCMS users/admin
DATABASE_DATA_URI=mongodb://localhost:27017/snf-data      # Backend-v3 data
PAYLOAD_SECRET=your-secret-key
BLOB_READ_WRITE_TOKEN=vercel-blob-token
```

### 2. Instalação

```bash
cd snf-cockpit-v1
pnpm install
pnpm run setup:integration
```

### 3. Primeira Execução

1. **Inicie o backend-v3** (popula dados via cron jobs)
2. **Inicie o cockpit**: `pnpm run dev`
3. **Acesse admin**: http://localhost:3000/admin
4. **Dados disponíveis imediatamente** - não precisa de sync!

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
│   │   ├── api/              # REST endpoints (leem PayloadCMS)
│   │   │   ├── pools/        # Pool management
│   │   │   ├── chains/       # Chain management  
│   │   │   ├── collections/  # NFT collections
│   │   │   └── tokens/       # Token management
│   │   ├── pools/            # Exemplo de interface
│   │   └── admin/            # PayloadCMS admin
│   └── lib/
│       ├── payloadcms/
│       │   └── collections/  # PayloadCMS collections (espelham backend-v3)
│       └── services/
│           └── rest/hooks/   # React hooks para frontend
├── scripts/
│   └── setup-integration.js # Setup automatizado
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