# Busca Social - Landing Page

## Overview
A landing page "Busca Social" é uma plataforma profissional em português brasileiro que promove o serviço gratuito da Maneco Gomes Empreendimentos. Seu propósito é cadastrar profissionais liberais e empresas em redes sociais (Facebook, Instagram, Blogger, LinkedIn), publicar no blog manecogomes.com.br, e garantir visibilidade nas primeiras páginas do Google em até 10 dias. O projeto visa facilitar a busca por profissionais via WhatsApp, oferecer prova social, e otimizar o processo de cadastro e visibilidade online, com foco na conversão e transparência.

## User Preferences
- Idioma: Português Brasileiro
- Foco: Conversão e clareza na comunicação
- Design: Profissional, limpo, inspirado em Nubank/GetNinjas
- Prioridade: Mobile-first

## System Architecture
A aplicação é uma landing page completa desenvolvida com React, TypeScript e Vite no frontend, utilizando Tailwind CSS e Shadcn UI para estilização. O backend é construído com Express.js e interage com um banco de dados PostgreSQL (Neon) via Drizzle ORM.

**UI/UX Decisions:**
- **Design System:** Cores primárias #1E88E5 (azul), #43A047 (verde), #FF7043 (laranja), e tipografia Poppins (headings) e Roboto (body).
- **Inspiração:** Interfaces limpas de Nubank e GetNinjas.
- **Responsividade:** Mobile-first.
- **SSL/HTTPS:** Redirecionamento automático de HTTP para HTTPS e de `www` para o domínio principal (`busca.social.br`).

**Technical Implementations & Feature Specifications:**
- **Hero Section:** Destaque para busca via WhatsApp com rotação animada de profissões clicáveis, abrindo o WhatsApp com mensagem pré-definida.
- **Social Proof:** Badge "Serviço de Utilidade Pública - 100% Gratuito" e integração com a Google Reviews API para exibir avaliações reais.
- **Benefícios e Transparência:** Explica as vantagens do cadastro gratuito e esclarece que os dados são publicados nas redes do Maneco Gomes.
- **Categorias Profissionais:** Galeria de 10 categorias mais buscadas com ícones e links clicáveis para WhatsApp.
- **Processo Visual:** Demonstra o fluxo de cadastro, publicação e busca.
- **CTA Cadastro Visual:** Seção atrativa com gradiente, cards de benefícios e botões direcionando para o cadastro oficial (manecogomes.com.br/profissionais) e WhatsApp.
- **FAQ:** 8 perguntas frequentes com accordion interativo.
- **SEO Otimizado:** Meta tags, Open Graph, Schema.org (LocalBusiness, FAQPage, Service), `robots.txt` e `sitemap.xml`.
- **Favicon:** Logo oficial profissional do Busca Social (lupa em azul #1E88E5 + pin de localização em verde #6BB344) gerado por IA e otimizado para navegadores e dispositivos Apple. Múltiplos tamanhos configurados (16x16, 32x32, 180x180) com fallback. Testado e funcionando corretamente (278KB PNG em public/favicon.png).
- **Formulário de Feedback:** Permite o envio de depoimentos com rating, que são salvos em banco e aparecem após aprovação.
- **Analytics:** Tracking de conversões (cliques no WhatsApp, cadastro oficial, profundidade de rolagem) via Google Analytics.
- **Formulário de Cadastro Completo:**
  - **REGRA 02 (Jan 2025):** 645 profissões completas disponíveis em TODOS os 3 campos de seleção de serviço
  - 27 estados e respectivas cidades com busca (Combobox)
  - **Validação de CPF (Jan 2025):** Implementado algoritmo brasileiro completo de validação de CPF
    - Aceita APENAS 11 dígitos numéricos (sem formatação)
    - Rejeita CPFs com dígitos repetidos (111.111.111-11, 000.000.000-00, etc)
    - Valida ambos os dígitos verificadores usando algoritmo oficial
    - Mensagens de erro claras e específicas
  - **Labels Atualizados (Jan 2025):**
    - "QUAL NOME devemos DIVULGAR nas propagandas e buscas?" (campo nome_divulgar)
    - "Logradouro (Rua, Av, etc), Número e Bairro ou escreva: Sem endereço físico!" (campo endereço)
  - Campos automáticos invisíveis: `serial_number` (contador sequencial que nunca repete) e `ip` (endereço IP do usuário)
  - Envio dual para webhooks n8n (produção e teste) com prioridade sobre banco de dados
  - Honeypot anti-spam
  - Logo SVG oficial em todas as páginas (header e confirmação)
  - **Sistema de E-mails de Confirmação (Jan 2025):**
    - SMTP: mail.busca.social.br:465 (equipe@busca.social.br)
    - E-mail automático para o profissional cadastrado com todos os dados
    - Cópia automática para equipe@manecogomes.com.br
    - Template HTML profissional com design gradient
    - Mensagem atualizada: "Seu cadastro foi enviado com sucesso. Após aprovação, será ativado nas buscas de nossas Redes Sociais e WhatsApp e, em até 10 dias úteis, seu perfil profissional poderá ser visível nas primeiras páginas do Google, conforme nossos Termos de Uso."
    - Link para Termos de Uso incluído no e-mail (https://busca.social.br/termos-de-uso)
- **API Endpoints para Consulta de Dados:**
  - `GET /api/stats` - Estatísticas gerais (totais, top profissões, distribuição por estado)
  - `GET /api/prestadores` - Lista todos os profissionais
  - `GET /api/prestadores/query?limit=X&offset=Y&estado=XX&profissao=XXX` - Busca com filtros e paginação
  - `GET /api/prestadores/serial/:serialNumber` - Busca por número serial
  - `GET /api/test-email` - Testa conexão SMTP

**System Design Choices:**
- **Estrutura de Projeto:** `client/` para frontend (páginas, hooks, componentes UI, utilitários) e `server/` para backend (rotas, armazenamento, conexão DB).
- **Gerenciamento de Estado:** TanStack Query para requisições assíncronas.
- **Formulários:** React Hook Form com Zod para validação.
- **Autenticação/Autorização:**
  - Sistema completo de autenticação com Passport.js (Local Strategy)
  - Gerenciamento de sessões com express-session e PostgreSQL session store
  - Hash de senhas usando scrypt (Node.js crypto)
  - Rotas protegidas com middleware requireAuth
  - Painel administrativo completo com CRUD para cities e professions

## External Dependencies
- **Banco de Dados:** PostgreSQL (via Neon Database) - Ver ACESSO_BANCO_DADOS.md para guia completo
- **APIs:** Google Reviews API (Google Places API)
- **Analytics:** Google Analytics (gtag)
- **Redes Sociais:** Facebook, Instagram, LinkedIn, Blogger
- **Comunicação:** WhatsApp (`https://wa.me/5524988418058`)
- **E-mail:** SMTP mail.busca.social.br:465 (nodemailer)
- **Blog/Cadastro Oficial:** `https://manecogomes.com.br`
- **Webhooks n8n:** Produção e Teste para integração de cadastros

## Recent Changes (Janeiro 2025)
- ✅ **CORREÇÃO CRÍTICA - Sistema de Sessões (Jan 2025):**
  - **Problema:** Session store tentava conectar ao Supabase antigo, causando erro 500 no login
  - **Solução:** Corrigido `server/storage.ts` para importar e usar o `pool` correto do Neon
  - **Resultado:** Login funcionando 100%, todas as rotas admin acessíveis
  - **Teste:** Login bem-sucedido retornando dados do admin corretamente
- ✅ **Serial Number Ajustado para começar em 801 (Jan 2025):**
  - **Mudança:** Arquivo `.serial-counter` ajustado de 4 para 800
  - **Resultado:** Próximos cadastros começarão com serial number 801, 802, 803...
- ✅ **Texto do Formulário de Cadastro Atualizado (Jan 2025):**
  - **Header:** Mudou de "100% Gratuito • Apareça no Google em até 10 dias" para "Serviço 100% Gratúito!"
  - **Footer:** Removida menção de "aparecerá no Google em até 10 dias" para manter consistência
  - **Nova mensagem:** Enfatiza apenas o serviço gratuito
- ✅ **Hero Section - Texto Aprimorado (Jan 2025):**
  - **Anterior:** "Profissional ! Cadastre-se gratuitamente para ser encontrado em nosso WhatsApp"
  - **Novo:** "Profissional! Cadastre-se e conecte-se com novos clientes pelo WhatsApp"
  - **Benefício:** Mensagem mais direta e focada na conexão com clientes
- ✅ **Favicon Profissional Implementado (Jan 2025):**
  - **Design:** Logo oficial com lupa azul (#1E88E5) + pin de localização verde (#6BB344)
  - **Geração:** Criado por IA com design limpo e profissional
  - **Otimização:** 278KB PNG otimizado (reduzido de 346KB)
  - **Configuração:** Múltiplos tamanhos (16x16, 32x32, 180x180) + apple-touch-icon + shortcut fallback
  - **Localização:** `public/favicon.png`
  - **Status:** Testado e validado via teste end-to-end automatizado
- ✅ **Sistema de Termos de Uso (Jan 2025):**
  - **Página Pública:** `/termos-de-uso` - Exibe os termos aceitos por ambos domínios (busca.social.br e manecogomes.com.br)
  - **Painel Admin:** `/admin/termos-de-uso` - Interface para edição do conteúdo dos termos (formato Markdown renderizado de forma segura)
  - **Banco de Dados:** Nova tabela `terms_of_use` com controle de versão e histórico de atualizações
  - **Formulário de Cadastro:** Checkbox obrigatório "Estou de acordo com os Termos de Uso" com link para a página
  - **Campo no Banco:** Campo `accepted_terms` (default 1) na tabela `prestadores`
  - **E-mail:** Inclusão de seção com link para Termos de Uso e confirmação de aceitação
  - **Webhook:** Campo `accepted_terms: true` adicionado ao payload enviado para n8n
  - **Mensagem WhatsApp:** Atualizada para "BUSCO PRESTADOR DE SERVIÇOS em acordo com os termos de uso. Pode me ajudar?"
  - **Footer:** Link para Termos de Uso adicionado em todas as páginas
  - **Conteúdo Inicial:** Termos padrão carregados automaticamente ao iniciar o servidor
  - **Criação Automática de Schema:** Funções `ensureTermsOfUseTable()` e `ensureAcceptedTermsColumn()` criam tabela/coluna automaticamente no startup
  - **Segurança:** Renderização de Markdown sem XSS (split por linhas, sem dangerouslySetInnerHTML)
  - **Validação:** Checkbox obrigatório com Zod refine (must be true), impedindo cadastro sem aceite
  - **Teste End-to-End:** Todos os fluxos testados e funcionando (visualização pública, edição admin, validação de formulário, cadastro completo)

## Recent Changes (Janeiro 2025)
- ✅ **REGRA 02 implementada:** 645 profissões completas nos 3 campos de serviço
- ✅ **Sistema de e-mails 100% funcional:** 
  - SMTP configurado e testado (mail.busca.social.br:465)
  - Envio dual automático (profissional + equipe@manecogomes.com.br)
  - Template HTML profissional com gradient azul/verde
  - Inclui número serial nos assuntos dos e-mails
  - Endpoint /api/test-email para verificação de conexão
- ✅ **Exibição do número serial:** Badge gradient na página de confirmação mostrando o serial gerado
- ✅ **Endpoints de consulta ao banco:** 4 novos endpoints para análise de dados
- ✅ **Bug crítico corrigido:** queryPrestadores agora usa and() do Drizzle corretamente
- ✅ **Documentação completa:** 
  - ACESSO_BANCO_DADOS.md - Guia de acesso ao PostgreSQL
  - COMO_TESTAR_EMAILS.md - Guia completo de teste do sistema de e-mails
- ✅ **Sistema de Autenticação e Painel Administrativo (Jan 2025):**
  - **Backend:**
    - Autenticação completa com Passport.js (Local Strategy) + express-session
    - Hash seguro de senhas com scrypt
    - Session store no PostgreSQL (connect-pg-simple)
    - Middleware requireAuth protegendo todas as rotas administrativas
    - Inicialização automática do usuário admin (manecogomes@gmail.com)
    - Novas tabelas: users, cities, professions
    - CRUD completo para cities e professions
    - Todas as rotas admin protegidas: /api/contacts, /api/stats, /api/prestadores/*, /api/test-email, /api/admin/*
  - **Frontend:**
    - Hook useAuth para gerenciar autenticação
    - Componente ProtectedRoute para proteger rotas
    - Página de login (/login) com validação
    - Painel admin (/admin) com navegação
    - Interface CRUD para cities (/admin/cities)
    - Interface CRUD para professions (/admin/professions)
    - Design profissional com Shadcn UI
  - **Credenciais Admin:**
    - Email: manecogomes@gmail.com
    - Usuário: manecogomes
    - Criado automaticamente na inicialização do servidor
  - **Segurança:**
    - Todas as rotas administrativas protegidas com requireAuth
    - Dados sensíveis (contatos, profissionais, estatísticas) apenas para usuários autenticados
    - Sessões armazenadas no banco de dados
- ✅ **Correção do Campo WhatsApp (Jan 2025):**
  - **Problema resolvido:** Duplicação do +55 e falta do 9º dígito automático
  - **Máscara de entrada implementada:**
    - Formatação automática enquanto o usuário digita: `(XX) XXXXX-XXXX`
    - Limita a 15 caracteres (11 dígitos + formatação)
    - Remove automaticamente caracteres não numéricos
    - Função customizada sem dependências externas
  - **Validação robusta no backend:**
    - Remove automaticamente código +55 se digitado (evita +55(55)...)
    - Adiciona 9º dígito automaticamente se número tiver 8 dígitos
    - Preserva DDD 55 (Caxias do Sul/RS) corretamente
    - Rejeita entradas inválidas com mensagens claras (extensões, dígitos extras, etc)
  - **Formato final garantido:** +55(XX)XXXXXXXXX
  - **Placeholder:** "(24) 98841-8058"