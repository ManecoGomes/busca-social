# Relatório Técnico Educacional - Busca Social

## Visão Geral do Projeto

**Nome:** Busca Social  
**Tipo:** Landing Page + Sistema de Cadastro de Profissionais  
**Público:** Profissionais liberais e empresas brasileiras  
**Objetivo:** Cadastrar profissionais para visibilidade em redes sociais e buscas via WhatsApp

---

# 1. ESTRUTURA DO PROJETO (O "Onde")

## 1.1 Arquitetura de Pastas

```
busca-social/
├── client/                    # FRONTEND (React)
│   └── src/
│       ├── pages/            # Páginas da aplicação (rotas)
│       ├── components/       # Componentes reutilizáveis
│       │   └── ui/           # Componentes Shadcn UI
│       ├── hooks/            # Hooks customizados React
│       ├── lib/              # Utilitários e configurações
│       └── data/             # Dados estáticos (profissões, estados)
├── server/                    # BACKEND (Express)
│   ├── index.ts              # Ponto de entrada do servidor
│   ├── routes.ts             # Definição das rotas API
│   ├── storage.ts            # Camada de acesso ao banco
│   ├── auth.ts               # Autenticação Passport.js
│   ├── email.ts              # Envio de e-mails SMTP
│   ├── serial-counter.ts     # Gerador de números sequenciais
│   └── vite.ts               # Integração Vite dev server
├── shared/                    # CÓDIGO COMPARTILHADO
│   └── schema.ts             # Schema do banco (Drizzle ORM)
├── public/                    # ARQUIVOS ESTÁTICOS
│   ├── favicon.png           # Ícone do site
│   ├── robots.txt            # Instruções SEO para crawlers
│   └── sitemap.xml           # Mapa do site para Google
└── scripts/                   # SCRIPTS DE MANUTENÇÃO
    ├── export-to-github.ts   # Exportação para GitHub
    ├── restore-professions.ts
    └── migrate-professions.ts
```

## 1.2 Justificativa da Estrutura

### Por que separar `client/`, `server/` e `shared/`?

**Princípio: Separação de Concerns (SoC)**

```
┌─────────────────────────────────────────────────────────┐
│                      NAVEGADOR                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   client/                          │  │
│  │  React + Vite + TypeScript + Tailwind             │  │
│  │  - Renderização da UI                              │  │
│  │  - Gerenciamento de estado local                   │  │
│  │  - Validação de formulários (frontend)             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTP/HTTPS (API REST)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      SERVIDOR                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   server/                          │  │
│  │  Express.js + Node.js                              │  │
│  │  - Processamento de requisições                    │  │
│  │  - Autenticação e autorização                      │  │
│  │  - Validação de dados (backend)                    │  │
│  │  - Integração com serviços externos                │  │
│  └───────────────────────────────────────────────────┘  │
│                           │                             │
│                           ▼                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   shared/                          │  │
│  │  Tipos TypeScript + Schemas Zod                    │  │
│  │  - Garantia de type-safety end-to-end              │  │
│  │  - Uma única fonte de verdade para tipos           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ SQL (Drizzle ORM)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  BANCO DE DADOS                         │
│                  PostgreSQL (Neon)                      │
└─────────────────────────────────────────────────────────┘
```

**Benefícios desta separação:**

1. **Manutenibilidade:** Cada camada pode ser modificada independentemente
2. **Testabilidade:** Facilita testes unitários isolados
3. **Escalabilidade:** Frontend pode ser hospedado em CDN separadamente
4. **Segurança:** Lógica sensível fica apenas no servidor
5. **Type-Safety:** `shared/` garante que frontend e backend falem a mesma "linguagem"

## 1.3 Arquivos e Suas Funções

### Frontend (`client/src/`)

| Arquivo | Função | Responsabilidade |
|---------|--------|------------------|
| `App.tsx` | Componente raiz | Configura rotas, providers (Query, Tooltip, Toast) |
| `main.tsx` | Entry point | Monta React no DOM |
| `pages/home.tsx` | Landing page | Hero, benefícios, categorias, FAQ, reviews |
| `pages/cadastro.tsx` | Formulário | Cadastro de profissionais com 15+ campos |
| `pages/confirmacao.tsx` | Feedback | Confirmação pós-cadastro com serial number |
| `pages/login.tsx` | Autenticação | Login administrativo |
| `pages/admin.tsx` | Dashboard | Painel principal do admin |
| `pages/admin-professions.tsx` | CRUD | Gerenciamento de profissões + importação |
| `pages/admin-cities.tsx` | CRUD | Gerenciamento de cidades por estado |
| `pages/admin-terms-of-use.tsx` | Editor | Edição dos termos de uso |
| `pages/termos-de-uso.tsx` | Visualização | Exibe termos públicos |
| `hooks/use-auth.ts` | Hook | Gerencia estado de autenticação |
| `hooks/use-toast.ts` | Hook | Sistema de notificações |
| `lib/queryClient.ts` | Config | Configuração do TanStack Query |
| `lib/utils.ts` | Helpers | Funções utilitárias (cn, formatters) |
| `data/cadastro-data.ts` | Dados | 644 profissões + 27 estados + cidades |

### Backend (`server/`)

| Arquivo | Função | Responsabilidade |
|---------|--------|------------------|
| `index.ts` | Bootstrap | Inicializa Express, middlewares, porta 5000 |
| `routes.ts` | API | Define todos os endpoints REST |
| `storage.ts` | DAL | Data Access Layer - todas as queries ao banco |
| `auth.ts` | Segurança | Passport.js, sessões, hash de senhas |
| `email.ts` | Integração | Envio de e-mails via SMTP |
| `serial-counter.ts` | Utilidade | Gera números sequenciais únicos |
| `vite.ts` | Dev | Integra Vite dev server com Express |

### Compartilhado (`shared/`)

| Arquivo | Função | Por que existe? |
|---------|--------|-----------------|
| `schema.ts` | Schema | Define tabelas do banco E tipos TypeScript simultaneamente |

**Por que `shared/schema.ts` é crucial:**

```typescript
// shared/schema.ts define:
// 1. A estrutura da tabela no banco (Drizzle ORM)
export const prestadores = pgTable("prestadores", {
  id: varchar("id").primaryKey(),
  names: text("names"),
  // ...
});

// 2. O schema de validação (Zod)
export const insertPrestadorSchema = createInsertSchema(prestadores);

// 3. Os tipos TypeScript (inferidos automaticamente)
export type Prestador = typeof prestadores.$inferSelect;
export type InsertPrestador = z.infer<typeof insertPrestadorSchema>;
```

**Resultado:** Uma única fonte de verdade que:
- Cria a tabela no PostgreSQL
- Valida dados no frontend (formulários)
- Valida dados no backend (API)
- Fornece tipos para IDE (autocomplete, erros em tempo de compilação)

---

# 2. DECISÕES TÉCNICAS (O "Porquê")

## 2.1 Stack Escolhida e Justificativas

### Frontend: React + TypeScript + Vite

**Por que React e não Vue/Angular/Svelte?**

| Critério | React | Vue | Angular | Svelte |
|----------|-------|-----|---------|--------|
| Ecossistema | Imenso | Grande | Grande | Pequeno |
| Mercado de trabalho | Dominante | Forte | Forte | Crescente |
| Integração Replit | Nativa | Boa | Complexa | Boa |
| Curva de aprendizado | Média | Baixa | Alta | Baixa |
| Flexibilidade | Alta | Média | Baixa | Alta |

**Decisão:** React é o padrão do Replit e oferece o maior ecossistema de componentes (Shadcn UI).

**Por que Vite e não Create React App (CRA)?**

```
CRA (Webpack):
- Build inicial: ~30-60 segundos
- Hot reload: ~2-5 segundos
- Bundle size: maior

Vite (ESBuild + Rollup):
- Build inicial: ~1-3 segundos
- Hot reload: ~50-300ms
- Bundle size: menor (tree-shaking melhor)
```

**Decisão:** Vite é 10-100x mais rápido em desenvolvimento. Em 2024/2025, não há razão técnica para usar CRA.

**Por que TypeScript e não JavaScript?**

```typescript
// JavaScript - erro só descoberto em PRODUÇÃO:
function cadastrarProfissional(dados) {
  console.log(dados.nme); // Typo! Deveria ser "nome"
  // Nenhum erro até rodar
}

// TypeScript - erro descoberto no EDITOR:
function cadastrarProfissional(dados: Prestador) {
  console.log(dados.nme); // ❌ Property 'nme' does not exist
  console.log(dados.names); // ✅ Autocomplete sugere o campo correto
}
```

**Decisão:** TypeScript previne bugs antes de chegarem a produção. O custo de setup é pago uma vez, o benefício é permanente.

### Backend: Express.js + Drizzle ORM

**Por que Express e não Fastify/Hono/Nest.js?**

| Framework | Performance | Simplicidade | Ecossistema | Curva |
|-----------|-------------|--------------|-------------|-------|
| Express | Boa | Alta | Imenso | Baixa |
| Fastify | Excelente | Média | Grande | Média |
| Hono | Excelente | Alta | Crescente | Baixa |
| Nest.js | Boa | Baixa | Grande | Alta |

**Decisão:** Express é o padrão do Replit, tem mais tutoriais, e para o volume esperado (< 10k req/dia), a diferença de performance é irrelevante.

**Por que Drizzle ORM e não Prisma/TypeORM/Sequelize?**

```typescript
// Prisma - Query gerada é "mágica" (não vemos o SQL)
const users = await prisma.user.findMany({
  where: { status: 'active' }
});

// Drizzle - Query é TypeScript puro, SQL explícito
const users = await db.select().from(users).where(eq(users.status, 'active'));
// SQL gerado: SELECT * FROM users WHERE status = 'active'
```

| ORM | Type-Safety | Performance | Bundle Size | SQL Control |
|-----|-------------|-------------|-------------|-------------|
| Drizzle | Excelente | Excelente | ~50KB | Total |
| Prisma | Boa | Boa | ~2MB | Parcial |
| TypeORM | Média | Média | ~500KB | Total |

**Decisão:** Drizzle é mais leve, mais rápido, e gera SQL previsível. Perfeito para Serverless (Neon).

### Banco: PostgreSQL (Neon)

**Por que PostgreSQL e não MySQL/MongoDB?**

```
PostgreSQL:
✅ Tipos avançados (JSONB, arrays, UUID nativo)
✅ Constraints complexas
✅ Full-text search nativo
✅ Padrão do Replit

MongoDB:
❌ Sem schema = bugs em produção
❌ Joins complexos são lentos
❌ Transactions mais complexas
```

**Por que Neon e não Supabase/PlanetScale?**

| Serviço | Free Tier | Serverless | Latência | Integração Replit |
|---------|-----------|------------|----------|-------------------|
| Neon | 0.5GB | Sim | Baixa | Nativa |
| Supabase | 500MB | Parcial | Média | Boa |
| PlanetScale | 5GB | Sim | Média | Boa |

**Decisão:** Neon é o banco padrão do Replit, zero configuração necessária.

### UI: Tailwind CSS + Shadcn UI

**Por que Tailwind e não Bootstrap/Material UI/CSS Modules?**

```css
/* CSS Tradicional - Arquivo separado, nomes inventados */
.meu-botao-primario-grande-azul {
  background-color: blue;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
}

/* Tailwind - Classes utilitárias, composição no HTML */
<button className="bg-blue-500 px-8 py-4 rounded-lg">
```

**Vantagens do Tailwind:**
1. **Colocation:** Estilo junto ao componente (menos context switching)
2. **Consistência:** Sistema de design forçado (cores, espaçamentos)
3. **Bundle size:** Apenas classes usadas são incluídas (PurgeCSS)
4. **Velocidade:** Não inventa nomes, não cria arquivos CSS

**Por que Shadcn UI e não Chakra/MUI/Radix puro?**

```typescript
// Shadcn - Componentes são COPIADOS para seu projeto
// Você tem controle total, pode modificar tudo
import { Button } from "@/components/ui/button";

// MUI/Chakra - Componentes são IMPORTADOS de node_modules
// Personalização limitada, bundle maior
import { Button } from "@mui/material";
```

**Decisão:** Shadcn permite personalização total e é baseado em Radix (acessibilidade excelente).

## 2.2 Dependências e Justificativas

### package.json - Dependências de Produção

```json
{
  "dependencies": {
    // === CORE ===
    "react": "^18.x",           // Biblioteca UI
    "react-dom": "^18.x",       // Renderização no browser
    "express": "^4.x",          // Servidor HTTP
    
    // === BANCO DE DADOS ===
    "drizzle-orm": "^0.x",      // ORM type-safe
    "@neondatabase/serverless": "^0.x", // Driver Neon (serverless)
    "pg": "^8.x",               // Driver PostgreSQL (sessões)
    
    // === AUTENTICAÇÃO ===
    "passport": "^0.x",         // Framework de autenticação
    "passport-local": "^1.x",   // Estratégia username/password
    "express-session": "^1.x",  // Gerenciamento de sessões
    "connect-pg-simple": "^9.x", // Store de sessões no PostgreSQL
    
    // === VALIDAÇÃO ===
    "zod": "^3.x",              // Validação de schemas
    "drizzle-zod": "^0.x",      // Integração Drizzle + Zod
    "react-hook-form": "^7.x",  // Gerenciamento de formulários
    "@hookform/resolvers": "^3.x", // Conecta Zod ao React Hook Form
    
    // === UI ===
    "@radix-ui/*": "^1.x",      // Componentes primitivos acessíveis
    "tailwind-merge": "^2.x",   // Merge inteligente de classes
    "class-variance-authority": "^0.x", // Variantes de componentes
    "lucide-react": "^0.x",     // Ícones SVG
    
    // === ROTEAMENTO ===
    "wouter": "^3.x",           // Roteamento leve (3KB vs 12KB React Router)
    
    // === DATA FETCHING ===
    "@tanstack/react-query": "^5.x", // Cache, loading states, mutations
    
    // === E-MAIL ===
    "nodemailer": "^6.x",       // Envio de e-mails SMTP
    
    // === UTILITÁRIOS ===
    "date-fns": "^3.x",         // Manipulação de datas
    "papaparse": "^5.x",        // Parser CSV
    "xlsx": "^0.x",             // Parser Excel
  }
}
```

### Por que cada dependência crítica?

**@tanstack/react-query vs fetch puro:**

```typescript
// Sem React Query - Você gerencia TUDO manualmente
function Profissoes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/professions')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e); setLoading(false); });
  }, []);
  
  // E se precisar revalidar? Cache? Retry? Polling?
  // Cada feature = mais código manual
}

// Com React Query - Tudo declarativo
function Profissoes() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['professions'],
    staleTime: 5 * 60 * 1000, // Cache por 5 min
    retry: 3, // Tenta 3x se falhar
  });
  
  // Cache, loading, error, refetch, polling = GRÁTIS
}
```

**react-hook-form vs useState para formulários:**

```typescript
// Sem react-hook-form - 15 campos = 15 useStates
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [cpf, setCpf] = useState('');
// ... mais 12 estados
// Validação manual em cada onChange
// Performance: re-render em cada keystroke

// Com react-hook-form
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { nome: '', email: '', cpf: '' }
});
// Validação automática
// Performance: re-render apenas no submit
// Integração nativa com Zod
```

**wouter vs react-router:**

```
react-router-dom:
- Bundle: ~12KB gzipped
- Features: Loaders, actions, defer, outlet
- Complexidade: Alta

wouter:
- Bundle: ~3KB gzipped  
- Features: Routing básico
- Complexidade: Baixa
```

**Decisão:** Para uma landing page simples, wouter é suficiente. Menos código = menos bugs.

---

# 3. LÓGICA E FLUXO DA APLICAÇÃO

## 3.1 Fluxo de Cadastro de Profissional

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USUÁRIO (Browser)                            │
└─────────────────────────────────────────────────────────────────────┘
                                │
                    1. Acessa /cadastro
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FORMULÁRIO (React)                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ react-hook-form + zodResolver                                │   │
│  │                                                               │   │
│  │ 2. Usuário preenche 15+ campos                               │   │
│  │    - Nome, E-mail, WhatsApp                                   │   │
│  │    - CPF (validação brasileira)                               │   │
│  │    - Profissões (1-3 seleções)                                │   │
│  │    - Estado, Cidade                                           │   │
│  │    - Endereço, Descrição                                      │   │
│  │    - Aceite dos Termos ✓                                      │   │
│  │                                                               │   │
│  │ 3. Validação CLIENT-SIDE (Zod)                               │   │
│  │    - CPF: 11 dígitos + algoritmo verificador                  │   │
│  │    - WhatsApp: formato brasileiro                             │   │
│  │    - Campos obrigatórios                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                    4. POST /api/prestadores
                       (TanStack Query mutation)
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express)                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ server/routes.ts                                             │   │
│  │                                                               │   │
│  │ 5. Validação SERVER-SIDE (Zod - segunda camada)              │   │
│  │    - Nunca confiar apenas no frontend                         │   │
│  │                                                               │   │
│  │ 6. Processamento de dados:                                    │   │
│  │    a) Gera serial_number único (801, 802, ...)               │   │
│  │    b) Captura IP do request (x-forwarded-for)                │   │
│  │    c) Normaliza WhatsApp (+55 + 9º dígito)                   │   │
│  │    d) Formata dados para banco                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                │                                    │
│                                ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ server/storage.ts                                            │   │
│  │                                                               │   │
│  │ 7. INSERT no PostgreSQL                                       │   │
│  │    - Drizzle ORM gera SQL type-safe                          │   │
│  │    - Retorna registro com ID gerado                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                │                                    │
│                                ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ server/email.ts                                              │   │
│  │                                                               │   │
│  │ 8. Disparo de e-mails (assíncrono):                          │   │
│  │    a) E-mail para o profissional (confirmação)               │   │
│  │    b) Cópia para equipe@manecogomes.com.br                   │   │
│  │    - Não bloqueia a resposta HTTP                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                │                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Webhook n8n (opcional)                                       │   │
│  │                                                               │   │
│  │ 9. Envia dados para automação externa                        │   │
│  │    - Integração com CRM, planilhas, etc.                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                    10. Response: { success: true, serial_number: 801 }
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                               │
│                                                                     │
│  11. TanStack Query recebe resposta                                 │
│  12. onSuccess: redirect para /confirmacao?serial=801              │
│  13. Página de confirmação exibe badge com serial number            │
└─────────────────────────────────────────────────────────────────────┘
```

## 3.2 Funções Críticas Explicadas

### Validação de CPF

```typescript
// client/src/pages/cadastro.tsx

function validateCPF(cpf: string): boolean {
  // 1. Remove formatação (pontos, traços)
  const cleaned = cpf.replace(/\D/g, '');
  
  // 2. Verifica se tem 11 dígitos
  if (cleaned.length !== 11) return false;
  
  // 3. Rejeita CPFs com todos os dígitos iguais
  // Ex: 111.111.111-11 passa no algoritmo mas é inválido
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // 4. Calcula primeiro dígito verificador
  // Algoritmo: multiplica cada dígito por peso decrescente (10-2)
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  let firstDigit = remainder === 10 ? 0 : remainder;
  
  // 5. Verifica primeiro dígito
  if (firstDigit !== parseInt(cleaned[9])) return false;
  
  // 6. Calcula segundo dígito verificador
  // Algoritmo: multiplica cada dígito por peso decrescente (11-2)
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  let secondDigit = remainder === 10 ? 0 : remainder;
  
  // 7. Verifica segundo dígito
  return secondDigit === parseInt(cleaned[10]);
}
```

**Por que validar no frontend E no backend?**

```
Frontend (UX):     Backend (Segurança):
- Feedback rápido  - Nunca confiar no cliente
- Evita request    - Atacante pode burlar JS
  desnecessário    - Validação é última defesa
```

### Gerador de Serial Number

```typescript
// server/serial-counter.ts

import * as fs from 'fs';

const COUNTER_FILE = '.serial-counter';
const INITIAL_VALUE = 800; // Próximo será 801

export function getNextSerialNumber(): number {
  let current = INITIAL_VALUE;
  
  // 1. Lê valor atual do arquivo
  if (fs.existsSync(COUNTER_FILE)) {
    const content = fs.readFileSync(COUNTER_FILE, 'utf-8');
    current = parseInt(content, 10) || INITIAL_VALUE;
  }
  
  // 2. Incrementa
  const next = current + 1;
  
  // 3. Salva novo valor (persistência)
  fs.writeFileSync(COUNTER_FILE, next.toString());
  
  // 4. Retorna novo número
  return next;
}
```

**Por que arquivo e não banco?**

- **Velocidade:** Leitura de arquivo é mais rápida que query SQL
- **Atomicidade:** Evita race conditions em concorrência baixa
- **Simplicidade:** Não precisa de transação SQL

**Limitação:** Em alta concorrência, precisaria de lock ou UUID.

### Autenticação com Passport.js

```typescript
// server/auth.ts

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";

// 1. Configuração da estratégia
passport.use(
  new LocalStrategy(async (username, password, done) => {
    // Busca usuário no banco
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "Usuário não encontrado" });
    }
    
    // Verifica senha
    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
      return done(null, false, { message: "Senha incorreta" });
    }
    
    return done(null, user);
  })
);

// 2. Hash de senha (NÃO use MD5 ou SHA1!)
async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Gera salt aleatório (16 bytes)
    const salt = randomBytes(16).toString("hex");
    
    // scrypt: algoritmo resistente a GPU/ASIC
    // Parâmetros: senha, salt, comprimento, callback
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      // Formato: salt.hash (para verificação posterior)
      resolve(salt + "." + derivedKey.toString("hex"));
    });
  });
}

// 3. Comparação segura (timing-safe)
async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(".");
  
  return new Promise((resolve, reject) => {
    scrypt(supplied, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      // timingSafeEqual previne timing attacks
      resolve(timingSafeEqual(
        Buffer.from(hash, "hex"),
        derivedKey
      ));
    });
  });
}
```

**Por que scrypt e não bcrypt?**

| Algoritmo | Velocidade | Resistência GPU | Memória |
|-----------|------------|-----------------|---------|
| MD5/SHA1 | Ultra rápido | Nenhuma | Nenhuma |
| bcrypt | Lento | Baixa | Baixa |
| scrypt | Lento | Alta | Alta |
| Argon2 | Configurável | Muito alta | Alta |

**Decisão:** scrypt é nativo do Node.js (crypto) e suficientemente seguro. Argon2 seria melhor mas requer dependência nativa.

---

# 4. PASSO A PASSO DA CONSTRUÇÃO

## Ordem Cronológica de Desenvolvimento

### Fase 1: Setup Inicial (Dia 1)

```bash
# 1. Projeto criado no Replit com template Node.js + Vite + React

# 2. Estrutura de pastas criada:
mkdir -p client/src/{pages,components,hooks,lib,data}
mkdir -p server
mkdir -p shared
mkdir -p public

# 3. Configuração TypeScript (tsconfig.json)
# 4. Configuração Tailwind (tailwind.config.ts)
# 5. Configuração Vite (vite.config.ts)
```

### Fase 2: Schema do Banco (Dia 2)

```typescript
// shared/schema.ts criado PRIMEIRO
// Por quê? É a "fonte de verdade" para todo o sistema

export const prestadores = pgTable("prestadores", {
  id: varchar("id").primaryKey(),
  names: text("names"),
  // ... todos os campos definidos
});

// Schemas de validação derivados automaticamente
export const insertPrestadorSchema = createInsertSchema(prestadores);
```

**Princípio:** Data Model First. O schema define:
- Estrutura do banco
- Tipos TypeScript
- Validação Zod

### Fase 3: Backend Básico (Dia 3)

```typescript
// 1. server/index.ts - Inicialização
const app = express();
app.use(express.json());
app.use(cors());

// 2. server/storage.ts - Camada de dados
export class DatabaseStorage implements IStorage {
  async createPrestador(data: InsertPrestador) {
    return db.insert(prestadores).values(data).returning();
  }
}

// 3. server/routes.ts - Endpoints
app.post("/api/prestadores", async (req, res) => {
  const validated = insertPrestadorSchema.parse(req.body);
  const result = await storage.createPrestador(validated);
  res.json(result);
});
```

### Fase 4: Frontend Básico (Dia 4-5)

```typescript
// 1. Páginas criadas em ordem de prioridade:
//    - home.tsx (landing page)
//    - cadastro.tsx (formulário)
//    - confirmacao.tsx (feedback)

// 2. Componentes UI importados do Shadcn
npx shadcn@latest add button card form input select

// 3. Integração com backend via TanStack Query
const mutation = useMutation({
  mutationFn: (data) => apiRequest("/api/prestadores", "POST", data),
  onSuccess: () => navigate("/confirmacao")
});
```

### Fase 5: Autenticação (Dia 6)

```typescript
// 1. server/auth.ts - Passport + Sessões
// 2. Tabela users criada
// 3. Login/logout endpoints
// 4. Middleware requireAuth
// 5. client/src/pages/login.tsx
// 6. client/src/hooks/use-auth.ts
```

### Fase 6: Painel Admin (Dia 7-8)

```typescript
// 1. admin.tsx - Dashboard
// 2. admin-professions.tsx - CRUD profissões + import CSV
// 3. admin-cities.tsx - CRUD cidades
// 4. admin-terms-of-use.tsx - Editor de termos
```

### Fase 7: Integrações (Dia 9-10)

```typescript
// 1. E-mail (nodemailer)
// 2. Google Reviews API
// 3. WhatsApp links
// 4. Webhooks n8n
```

### Fase 8: SEO e Polimento (Dia 11)

```html
<!-- Meta tags, Open Graph, Schema.org -->
<!-- robots.txt, sitemap.xml -->
<!-- Favicon otimizado -->
```

### Fase 9: Documentação e Deploy (Dia 12)

```bash
# Documentação criada
# Export para GitHub
# Publicação no Replit
```

---

# 5. PRÓXIMOS PASSOS E MANUTENÇÃO

## 5.1 O Que Falta Para Produção Real?

### Crítico (Fazer Antes de Lançar)

| Item | Status | Ação Necessária |
|------|--------|-----------------|
| HTTPS | ✅ Replit | Automático no Replit |
| Rate Limiting | ❌ | Implementar express-rate-limit |
| CAPTCHA | ❌ | Adicionar reCAPTCHA no cadastro |
| Backup automático | ⚠️ Parcial | Configurar backup Neon |
| Monitoramento | ❌ | Adicionar Sentry ou similar |
| Logs estruturados | ❌ | Implementar Winston ou Pino |

### Importante (Fazer em 30 dias)

| Item | Por quê? |
|------|----------|
| Testes automatizados | Prevenir regressões |
| CI/CD | Deploy automático |
| Métricas de negócio | Entender conversão |
| A/B testing | Otimizar formulário |

## 5.2 Refatorações Sugeridas

### 1. Rate Limiting (Segurança)

```typescript
// server/index.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas requisições, tente novamente depois'
});

app.use('/api/', limiter);
```

### 2. Centralização de Erros

```typescript
// server/error-handler.ts
export function errorHandler(err, req, res, next) {
  console.error(err);
  
  if (err instanceof ZodError) {
    return res.status(400).json({ 
      error: 'Validação falhou', 
      details: err.errors 
    });
  }
  
  if (err instanceof AuthError) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  
  return res.status(500).json({ error: 'Erro interno' });
}

// Uso: app.use(errorHandler);
```

### 3. Separação de Concerns nos Routes

```typescript
// ANTES: Lógica misturada no route
app.post("/api/prestadores", async (req, res) => {
  const validated = schema.parse(req.body);
  const serial = getNextSerialNumber();
  const ip = getClientIP(req);
  // ... mais lógica
});

// DEPOIS: Controllers separados
// server/controllers/prestador.controller.ts
export class PrestadorController {
  async create(req, res) {
    const result = await this.prestadorService.create(req.body, req);
    res.json(result);
  }
}

// server/services/prestador.service.ts
export class PrestadorService {
  async create(data, req) {
    const validated = this.validate(data);
    const serial = this.serialService.next();
    const ip = this.getClientIP(req);
    return this.storage.create({ ...validated, serial, ip });
  }
}
```

### 4. Caching para Profissões

```typescript
// Profissões são estáticas, não precisam de query toda hora
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hora

app.get('/api/professions', async (req, res) => {
  let professions = cache.get('professions');
  
  if (!professions) {
    professions = await storage.getProfessions();
    cache.set('professions', professions);
  }
  
  res.json(professions);
});
```

## 5.3 Escalabilidade Futura

### Se o sistema crescer 10x:

1. **CDN para assets estáticos** (Cloudflare, Vercel Edge)
2. **Read replicas** para queries de leitura
3. **Queue** para envio de e-mails (Bull, BullMQ)
4. **Cache distribuído** (Redis)

### Se o sistema crescer 100x:

1. **Microserviços** (separar cadastro, e-mail, admin)
2. **Kubernetes** ou similar
3. **Event sourcing** para auditoria
4. **API Gateway** (Kong, AWS API Gateway)

---

# CONCLUSÃO

Este projeto demonstra uma arquitetura moderna de aplicação web full-stack:

1. **Type-Safety End-to-End:** TypeScript + Zod + Drizzle garantem que erros são detectados em tempo de compilação
2. **Separação Clara:** Frontend, backend e schema vivem em mundos separados mas conversam através de tipos compartilhados
3. **Escolhas Pragmáticas:** Cada tecnologia foi escolhida por razões específicas, não por hype
4. **Segurança por Design:** Validação dupla, hash de senhas, sessões seguras
5. **Developer Experience:** Hot reload, autocomplete, erros claros

O sistema está funcional e pronto para uso, com espaço claro para melhorias incrementais conforme a demanda crescer.

---

*Relatório gerado em Janeiro 2025*  
*Por: Tech Lead Sênior*
