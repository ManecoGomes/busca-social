# Documentação Completa - Busca Social

## Visão Geral

**URLs do Projeto:**
- Produção: https://busca.social.br (domínio customizado)
- Replit: https://buscasocial.replit.app

**Propósito:**
Landing page profissional em português brasileiro que promove o serviço gratuito da Maneco Gomes Empreendimentos. O objetivo é cadastrar profissionais liberais e empresas para visibilidade em redes sociais e buscas via WhatsApp.

**Público-alvo:**
1. **Usuários** - Pessoas que buscam profissionais (eletricistas, encanadores, etc.)
2. **Prestadores** - Profissionais que querem ser encontrados por clientes

---

## Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Estilização** | Tailwind CSS + Shadcn UI |
| **Roteamento** | Wouter |
| **Estado/Requisições** | TanStack Query v5 |
| **Formulários** | React Hook Form + Zod |
| **Backend** | Express.js + TypeScript |
| **Banco de Dados** | PostgreSQL (Neon Database) |
| **ORM** | Drizzle ORM |
| **Autenticação** | Passport.js (Local Strategy) |
| **Sessões** | express-session + connect-pg-simple |
| **E-mail** | Nodemailer (SMTP) |

---

## Estrutura de Pastas

```
/
├── client/                    # Frontend React
│   └── src/
│       ├── pages/            # Páginas da aplicação
│       ├── components/       # Componentes reutilizáveis
│       ├── hooks/            # Hooks customizados
│       ├── lib/              # Utilitários
│       └── data/             # Dados estáticos (profissões, estados)
├── server/                    # Backend Express
│   ├── index.ts              # Ponto de entrada
│   ├── routes.ts             # Rotas da API
│   ├── storage.ts            # Interface com banco de dados
│   ├── auth.ts               # Autenticação Passport.js
│   ├── email.ts              # Envio de e-mails SMTP
│   └── serial-counter.ts     # Gerador de serial numbers
├── shared/                    # Código compartilhado
│   └── schema.ts             # Schema do banco (Drizzle)
├── public/                    # Arquivos estáticos
│   ├── favicon.png           # Favicon do site
│   ├── robots.txt            # SEO
│   └── sitemap.xml           # SEO
└── scripts/                   # Scripts de manutenção
    ├── restore-professions.ts
    └── migrate-professions.ts
```

---

## Páginas da Aplicação

### Páginas Públicas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `home.tsx` | Landing page principal com hero, benefícios, como funciona, categorias, FAQ, avaliações Google |
| `/cadastro` | `cadastro.tsx` | Formulário completo de cadastro de profissionais |
| `/confirmacao` | `confirmacao.tsx` | Página de confirmação após cadastro com serial number |
| `/termos-de-uso` | `termos-de-uso.tsx` | Termos de uso públicos (renderiza Markdown) |
| `/login` | `login.tsx` | Página de login administrativo |

### Páginas Protegidas (Admin)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/admin` | `admin.tsx` | Dashboard administrativo |
| `/admin/professions` | `admin-professions.tsx` | CRUD de profissões + importação CSV/Excel |
| `/admin/cities` | `admin-cities.tsx` | CRUD de cidades por estado |
| `/admin/termos-de-uso` | `admin-terms-of-use.tsx` | Editor de termos de uso |

---

## Banco de Dados - Schema Completo

### Tabela: `users` (Usuários Administrativos)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | serial | Sim | ID auto-incrementado (PK) |
| `username` | text | Sim | Nome de usuário único |
| `email` | text | Sim | E-mail único |
| `password` | text | Sim | Hash da senha (scrypt) |
| `role` | text | Sim | Papel do usuário (default: "admin") |
| `created_at` | timestamp | Sim | Data de criação |

**Usuário admin inicial:**
- Username: `manecogomes`
- Email: `manecogomes@gmail.com`
- Senha: `@!Md887400@!`

---

### Tabela: `prestadores` (Cadastros de Profissionais)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | varchar (UUID) | Sim | ID único (PK) |
| `names` | text | Não | Nome completo |
| `email` | text | Não | E-mail do profissional |
| `input_mask_3` | text | Sim | WhatsApp (formato: +55(XX)XXXXXXXXX) |
| `input_radio_1` | text | Sim | Tipo de cadastro (Profissional Liberal / MEI / ME / Empresa) |
| `checkbox` | text | Sim | Sexo (Masculino / Feminino) |
| `numeric_field` | text | Sim | CPF (11 dígitos, validado) |
| `input_text` | text | Sim | Nome para divulgar nas propagandas |
| `input_radio` | text | Sim | Quantidade de profissões (1, 2 ou 3) |
| `multi_select` | text | Não | Serviço/Profissão 1 |
| `multi_select_2` | text | Não | Serviço/Profissão 2 |
| `multi_select_1` | text | Não | Serviço/Profissão 3 |
| `dropdown_2` | text | Sim | Estado (UF) |
| `dropdown_1` | text | Não | Cidade (campo legado para RJ) |
| `dropdown_3` | text | Não | Cidade (campo legado para MG) |
| `input_text_1` | text | Sim | Logradouro, número e bairro |
| `description` | text | Sim | Descrição do profissional/serviços |
| `serial_number` | integer | Sim | Número sequencial único (começa em 801) |
| `ip` | text | Sim | IP do usuário (capturado automaticamente) |
| `accepted_terms` | integer | Sim | Aceitou os termos (default: 1) |
| `webhook_status` | text | Não | Status do webhook produção (pending/sent/failed) |
| `webhook_test_status` | text | Não | Status do webhook teste |
| `created_at` | timestamp | Sim | Data de cadastro |

---

### Tabela: `professions` (Profissões)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | serial | Sim | ID auto-incrementado (PK) |
| `name` | text | Sim | Nome da profissão (único) |
| `category` | text | Não | Categoria (Construção, Saúde, etc.) |
| `is_active` | integer | Sim | Ativa (1) ou desativada (0) |
| `created_at` | timestamp | Sim | Data de criação |

**Total de profissões pré-cadastradas:** 644

---

### Tabela: `cities` (Cidades)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | serial | Sim | ID auto-incrementado (PK) |
| `name` | text | Sim | Nome da cidade |
| `state` | text | Sim | Sigla do estado (RJ, MG, SP, etc.) |
| `is_active` | integer | Sim | Ativa (1) ou desativada (0) |
| `created_at` | timestamp | Sim | Data de criação |

---

### Tabela: `contacts` (Leads/Contatos)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | varchar (UUID) | Sim | ID único (PK) |
| `name` | text | Sim | Nome do contato |
| `phone` | text | Sim | Telefone |
| `email` | text | Não | E-mail |
| `category` | text | Sim | Categoria profissional buscada |
| `message` | text | Não | Mensagem opcional |
| `created_at` | timestamp | Sim | Data de criação |

---

### Tabela: `testimonials` (Depoimentos)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | varchar (UUID) | Sim | ID único (PK) |
| `name` | text | Sim | Nome do autor |
| `profession` | text | Sim | Profissão do autor |
| `testimony` | text | Sim | Texto do depoimento |
| `rating` | integer | Sim | Avaliação de 1 a 5 estrelas |
| `is_approved` | integer | Sim | Aprovado (1) ou pendente (0) |
| `created_at` | timestamp | Sim | Data de criação |

---

### Tabela: `terms_of_use` (Termos de Uso)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | serial | Sim | ID auto-incrementado (PK) |
| `content` | text | Sim | Conteúdo em Markdown |
| `updated_at` | timestamp | Sim | Data da última atualização |
| `updated_by` | integer | Não | ID do admin que atualizou |

---

## Endpoints da API

### Públicos (Sem Autenticação)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/professions` | Lista todas as profissões ativas |
| GET | `/api/cities` | Lista todas as cidades ativas |
| GET | `/api/cities/:state` | Lista cidades de um estado específico |
| GET | `/api/google-reviews` | Busca avaliações reais do Google |
| GET | `/api/terms-of-use` | Retorna os termos de uso atuais |
| POST | `/api/contacts` | Cria um novo contato/lead |
| POST | `/api/testimonials` | Envia um novo depoimento (pendente aprovação) |
| POST | `/api/prestadores` | Cadastra um novo profissional |

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/login` | Login (username + password) |
| POST | `/api/logout` | Logout |
| GET | `/api/user` | Retorna usuário autenticado |

### Protegidos (Requer Login Admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/contacts` | Lista todos os contatos |
| GET | `/api/stats` | Estatísticas gerais do sistema |
| GET | `/api/prestadores` | Lista todos os prestadores |
| GET | `/api/prestadores/query` | Busca com filtros e paginação |
| GET | `/api/prestadores/serial/:serialNumber` | Busca por serial number |
| GET | `/api/test-email` | Testa conexão SMTP |
| POST | `/api/admin/professions` | Cria nova profissão |
| PUT | `/api/admin/professions/:id` | Atualiza profissão |
| DELETE | `/api/admin/professions/:id` | Remove profissão |
| POST | `/api/admin/professions/import` | Importa CSV/Excel de profissões |
| POST | `/api/admin/professions/migrate` | Migra profissões do arquivo estático |
| POST | `/api/admin/cities` | Cria nova cidade |
| PUT | `/api/admin/cities/:id` | Atualiza cidade |
| DELETE | `/api/admin/cities/:id` | Remove cidade |
| PUT | `/api/admin/terms-of-use` | Atualiza termos de uso |

---

## Integrações Externas

### 1. E-mail (SMTP)

| Configuração | Valor |
|--------------|-------|
| Servidor | mail.busca.social.br |
| Porta | 465 (SSL) |
| Usuário | equipe@busca.social.br |
| Segurança | TLS/SSL |

**Variáveis de ambiente necessárias:**
- `SMTP_HOST` - Servidor SMTP
- `SMTP_PORT` - Porta (465)
- `SMTP_USER` - Usuário
- `SMTP_PASS` - Senha
- `EMAIL_FROM` - E-mail remetente
- `EMAIL_COPY_TO` - E-mail para cópia (equipe@manecogomes.com.br)

**Fluxo de envio:**
1. Profissional faz cadastro
2. Sistema envia e-mail para o profissional com confirmação
3. Sistema envia cópia para equipe@manecogomes.com.br
4. E-mail inclui todos os dados, serial number e link para termos

---

### 2. Google Reviews API

**Variáveis de ambiente:**
- `GOOGLE_PLACES_API_KEY` - Chave da API do Google Places

**Place ID:** `ChIJY9ft-H8pmQAR-KQQF4uyT8c`

**Funcionamento:**
- Landing page faz requisição para `/api/google-reviews`
- Backend consulta Google Places API
- Retorna até 3 avaliações reais com nome, foto, texto e rating
- Exibe na seção de prova social

---

### 3. WhatsApp

**Número:** +55 24 98841-8058

**Links usados:**
- Buscar profissional: `https://wa.me/5524988418058?text=BUSCO PRESTADOR DE SERVIÇOS em acordo com os termos de uso. Pode me ajudar?`
- Cadastrar-se: `https://wa.me/5524988418058?text=Quero efetuar meu cadastro como prestador de serviço.`

---

### 4. Webhooks n8n

O sistema pode enviar dados de cadastro para webhooks n8n para automação:

**Payload enviado:**
```json
{
  "serial_number": 801,
  "names": "João Silva",
  "email": "joao@email.com",
  "whatsapp": "+55(24)988418058",
  "tipo_cadastro": "Profissional Liberal",
  "sexo": "Masculino",
  "cpf": "12345678901",
  "nome_divulgar": "João Eletricista",
  "servico1": "Eletricista",
  "servico2": "Instalador",
  "servico3": null,
  "estado": "RJ",
  "cidade": "Petrópolis",
  "endereco": "Rua das Flores, 123 - Centro",
  "descricao": "Eletricista com 10 anos de experiência...",
  "ip": "189.45.123.67",
  "accepted_terms": true,
  "created_at": "2025-01-06T10:30:00Z"
}
```

---

## Formulário de Cadastro - Detalhes

### Campos do Formulário

| Campo | Label | Tipo | Validação |
|-------|-------|------|-----------|
| names | Nome completo | text | Opcional |
| email | E-mail | email | Formato de e-mail válido |
| input_mask_3 | WhatsApp | tel | Máscara (XX) XXXXX-XXXX, 11 dígitos |
| input_radio_1 | Tipo de cadastro | radio | Profissional Liberal, MEI, ME, Empresa |
| checkbox | Sexo | radio | Masculino, Feminino |
| numeric_field | CPF | text | 11 dígitos, algoritmo de validação brasileiro |
| input_text | Nome para divulgar | text | Mínimo 2 caracteres |
| input_radio | Quantidade de serviços | radio | 1, 2 ou 3 |
| multi_select | Serviço 1 | select | 644+ opções de profissões |
| multi_select_2 | Serviço 2 | select | Aparece se quantidade >= 2 |
| multi_select_1 | Serviço 3 | select | Aparece se quantidade = 3 |
| dropdown_2 | Estado | select | 27 estados brasileiros |
| dropdown_1 | Cidade | combobox | Lista dinâmica por estado |
| input_text_1 | Endereço | text | Logradouro, número e bairro |
| description | Descrição | textarea | Mínimo 10 caracteres |
| terms_accepted | Termos de uso | checkbox | Obrigatório (deve ser true) |

### Campos Automáticos (Invisíveis)

| Campo | Descrição |
|-------|-----------|
| serial_number | Número sequencial único (começa em 801) |
| ip | Endereço IP do usuário (capturado pelo backend) |
| accepted_terms | Sempre 1 quando o formulário é enviado |

### Validação de CPF

O sistema implementa o algoritmo brasileiro completo:
1. Remove formatação (pontos, traços)
2. Verifica se tem exatamente 11 dígitos
3. Rejeita CPFs com todos os dígitos iguais (111.111.111-11, etc.)
4. Calcula e valida os dois dígitos verificadores

### Validação de WhatsApp

1. Máscara automática: (XX) XXXXX-XXXX
2. Backend remove código +55 se digitado
3. Adiciona 9º dígito automaticamente se necessário
4. Formato final salvo: +55(XX)XXXXXXXXX

---

## Sistema de Autenticação

### Tecnologias

- **Passport.js** com estratégia Local
- **express-session** para gerenciamento de sessões
- **connect-pg-simple** para armazenar sessões no PostgreSQL
- **scrypt** (Node.js crypto) para hash de senhas

### Fluxo de Login

1. Usuário acessa `/login`
2. Digita username e senha
3. Backend verifica credenciais com Passport
4. Se válido, cria sessão no banco de dados
5. Cookie de sessão enviado ao navegador
6. Todas as rotas `/api/admin/*` verificam sessão

### Middleware de Proteção

```typescript
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
```

---

## SEO Implementado

### Meta Tags

- Title único por página
- Meta description otimizada
- Open Graph tags para redes sociais
- Viewport responsivo

### Arquivos Estáticos

- `/robots.txt` - Instruções para crawlers
- `/sitemap.xml` - Mapa do site para indexação

### Schema.org

- LocalBusiness
- FAQPage
- Service

### Headers

```
X-Robots-Tag: index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1
```

---

## Funcionalidades Especiais

### 1. Inicialização Automática

Ao iniciar o servidor, o sistema automaticamente:
- Cria usuário admin se não existir
- Cria tabela terms_of_use se não existir
- Carrega 644 profissões se banco tiver menos de 500
- Carrega termos de uso padrão se não existir

### 2. Importação CSV/Excel

No painel admin (`/admin/professions`):
- Botão "Importar CSV/Excel"
- Aceita arquivos .csv, .xlsx, .xls
- Colunas aceitas: nome, profissao, name, profession
- Detecta e pula duplicadas
- Mostra resumo: adicionadas, puladas, erros

### 3. Serial Number

- Cada cadastro recebe um número único sequencial
- Começa em 801
- Nunca repete
- Salvo em arquivo `.serial-counter` e no banco

### 4. Captura de IP

- Backend captura automaticamente o IP do usuário
- Usa headers x-forwarded-for para proxies
- Armazenado para fins de segurança/auditoria

---

## Variáveis de Ambiente Necessárias

```env
# Banco de Dados (Neon PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/db
PGHOST=host
PGPORT=5432
PGUSER=user
PGPASSWORD=pass
PGDATABASE=db

# Sessões
SESSION_SECRET=sua-chave-secreta-segura

# E-mail (SMTP)
SMTP_HOST=mail.busca.social.br
SMTP_PORT=465
SMTP_USER=equipe@busca.social.br
SMTP_PASS=sua-senha-smtp
EMAIL_FROM=equipe@busca.social.br
EMAIL_COPY_TO=equipe@manecogomes.com.br

# Google Reviews
GOOGLE_PLACES_API_KEY=sua-chave-google-api

# Webhooks n8n (opcional)
N8N_WEBHOOK_URL=https://seu-n8n/webhook/xxx
N8N_WEBHOOK_TEST_URL=https://seu-n8n/webhook/test
```

---

## Como Criar um Site Semelhante no Replit

### Passo 1: Criar o Projeto

1. Acesse replit.com e crie novo projeto
2. Escolha template "Node.js + Vite + React + Express"
3. Ou use o template "Full Stack JavaScript"

### Passo 2: Estrutura Básica

Solicite ao Replit Agent:

> "Crie uma landing page profissional em português brasileiro com:
> - Frontend: React + Vite + TypeScript + Tailwind CSS + Shadcn UI
> - Backend: Express.js + Drizzle ORM + PostgreSQL
> - Formulário de cadastro com campos: nome, email, telefone, CPF, profissão, estado, cidade, endereço, descrição
> - Sistema de serial number único para cada cadastro
> - Captura automática de IP
> - Validação de CPF com algoritmo brasileiro
> - Envio de e-mail de confirmação via SMTP
> - Painel admin com login para gerenciar dados
> - SEO otimizado com meta tags e sitemap"

### Passo 3: Banco de Dados

1. Ative o PostgreSQL no painel do Replit
2. As variáveis DATABASE_URL, PGHOST, etc. serão criadas automaticamente

### Passo 4: Configurar Secrets

No painel "Secrets" do Replit, adicione:
- SESSION_SECRET
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- EMAIL_FROM, EMAIL_COPY_TO
- GOOGLE_PLACES_API_KEY (se usar Google Reviews)

### Passo 5: Publicar

1. Clique em "Publish" no painel do Replit
2. Configure domínio customizado se desejar
3. O site estará acessível via .replit.app ou seu domínio

---

## Resumo das Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| Landing Page | Hero com busca via WhatsApp, benefícios, como funciona, categorias, FAQ |
| Formulário de Cadastro | 15+ campos, validação CPF/WhatsApp, serial automático, captura IP |
| E-mail Automático | Confirmação para profissional + cópia para equipe |
| Google Reviews | Integração com API para exibir avaliações reais |
| WhatsApp | Links diretos para buscar profissional ou cadastrar-se |
| Painel Admin | Login seguro, CRUD de profissões/cidades, importação CSV/Excel |
| Termos de Uso | Editáveis pelo admin, obrigatórios no cadastro |
| SEO | Meta tags, sitemap, robots.txt, Schema.org |
| Autenticação | Passport.js, sessões no banco, senhas com hash |
| Inicialização Automática | Admin, profissões e termos criados automaticamente |

---

*Documentação gerada em: Janeiro 2025*
*Versão do sistema: 1.0*
