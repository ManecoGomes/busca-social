# 📊 Guia de Acesso ao Banco de Dados - Busca Social

## 🎯 Como Acessar o Banco de Dados

Você tem **4 formas diferentes** de acessar e consultar os dados cadastrados:

---

## **1️⃣ Via Interface do Replit (Mais Fácil)**

### Passo a Passo:
1. **Clique em "Tools"** no menu lateral esquerdo do Replit
2. **Clique em "Database"**
3. Você verá a interface visual com:
   - Lista de todas as tabelas
   - Dados em formato de tabela
   - Editor de SQL para consultas personalizadas

### Vantagens:
✅ Visual e intuitivo  
✅ Não precisa de código  
✅ Ideal para visualizar dados rapidamente

---

## **2️⃣ Via Endpoints de API (Recomendado para Consultas)**

A aplicação possui endpoints de API prontos para consultar os dados:

### **📊 Estatísticas Gerais**
```bash
GET http://localhost:5000/api/stats
```

**Retorna:**
- Total de profissionais cadastrados
- Total de contatos
- Total de depoimentos
- Top 10 profissões mais cadastradas
- Distribuição por estado

**Exemplo de uso no navegador:**
```
http://localhost:5000/api/stats
```

---

### **👤 Buscar Todos os Profissionais**
```bash
GET http://localhost:5000/api/prestadores
```

**Retorna:** Lista completa de todos os profissionais cadastrados (ordenados por data)

---

### **🔍 Buscar com Filtros e Paginação**
```bash
GET http://localhost:5000/api/prestadores/query?limit=20&offset=0&estado=RJ&profissao=Advogado
```

**Parâmetros disponíveis:**
- `limit` - Quantidade de resultados (padrão: 50)
- `offset` - Pular resultados (para paginação)
- `estado` - Filtrar por estado (ex: RJ, SP, MG)
- `profissao` - Filtrar por profissão (busca em todos os 3 campos de serviço)

**Exemplos:**
```
# Primeiros 10 advogados do RJ
http://localhost:5000/api/prestadores/query?limite=10&estado=RJ&profissao=Advogado

# Todos os eletricistas
http://localhost:5000/api/prestadores/query?profissao=Eletricista

# Página 2 (registros 50-100)
http://localhost:5000/api/prestadores/query?limit=50&offset=50
```

---

### **🔢 Buscar por Número de Série**
```bash
GET http://localhost:5000/api/prestadores/serial/123
```

**Retorna:** Dados completos do profissional com aquele número serial

**Exemplo:**
```
http://localhost:5000/api/prestadores/serial/1
```

---

## **3️⃣ Via Código SQL Direto (Para Consultas Avançadas)**

Se você quiser fazer consultas SQL mais complexas, me peça! Por exemplo:

**Exemplos de consultas que posso fazer para você:**
```sql
-- Contar quantos profissionais por estado
SELECT dropdown_2 as estado, COUNT(*) as total 
FROM prestadores 
GROUP BY dropdown_2 
ORDER BY total DESC;

-- Listar todos os advogados do RJ
SELECT names, input_text, input_mask_3, dropdown_1 
FROM prestadores 
WHERE dropdown_2 = 'RJ' 
AND (multi_select LIKE '%Advogado%' 
     OR multi_select_2 LIKE '%Advogado%' 
     OR multi_select_1 LIKE '%Advogado%');

-- Ver últimos 10 cadastros
SELECT serial_number, names, input_text, multi_select, createdat 
FROM prestadores 
ORDER BY createdat DESC 
LIMIT 10;
```

---

## **4️⃣ Criar uma Página de Administração (Futuro)**

Posso criar uma página de administração visual onde você pode:
- Ver tabelas formatadas
- Exportar dados para Excel/CSV
- Filtrar e buscar interativamente
- Ver gráficos e estatísticas

**Quer que eu crie essa página?** É só pedir!

---

## 📋 **Estrutura das Tabelas**

### **Tabela: prestadores** (Profissionais Cadastrados)

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `id` | ID único (UUID) | "550e8400-e29b-41d4-a716-..." |
| `serial_number` | Número sequencial | 1, 2, 3... |
| `names` | Nome completo | "João da Silva" |
| `input_text` | Nome para divulgar | "João Silva - Advogado" |
| `email` | E-mail | "joao@example.com" |
| `input_mask_3` | WhatsApp formatado | "+55(24)99999-9999" |
| `numeric_field` | CPF | "12345678901" |
| `input_radio_1` | Tipo (1=Autônomo, 2=Empresa) | "1" |
| `checkbox` | Sexo (1=M, 2=F, 3=Outro) | "1" |
| `input_radio` | Qtd profissões (1, 2 ou 3) | "2" |
| `multi_select` | Serviço 1 | "Advogado Criminal" |
| `multi_select_2` | Serviço 2 (opcional) | "Advogado Trabalhista" |
| `multi_select_1` | Serviço 3 (opcional) | "Advogado Cível" |
| `dropdown_2` | Estado | "RJ" |
| `dropdown_1` | Cidade (se RJ) | "Rio de Janeiro" |
| `dropdown_3` | Cidade (se MG) | "Belo Horizonte" |
| `input_text_1` | Logradouro | "Rua das Flores, 123" |
| `description` | Descrição dos serviços | "Atendo casos criminais..." |
| `ip` | IP do cadastro | "177.125.34.89" |
| `createdat` | Data do cadastro | "2025-01-20 14:30:00" |

---

### **Tabela: contacts** (Contatos/Leads)

| Campo | Descrição |
|-------|-----------|
| `id` | ID único |
| `name` | Nome |
| `phone` | Telefone |
| `email` | E-mail |
| `category` | Categoria profissional |
| `message` | Mensagem |
| `created_at` | Data |

---

### **Tabela: testimonials** (Depoimentos)

| Campo | Descrição |
|-------|-----------|
| `id` | ID único |
| `name` | Nome |
| `profession` | Profissão |
| `testimony` | Texto do depoimento |
| `rating` | Nota (1-5) |
| `is_approved` | Aprovado? (0=Não, 1=Sim) |
| `created_at` | Data |

---

## 💡 **Ideias para Usar os Dados**

Agora que você tem acesso ao banco, pode:

1. **📈 Criar Dashboards**
   - Gráficos de profissões mais cadastradas
   - Distribuição geográfica
   - Crescimento ao longo do tempo

2. **📧 Campanhas de E-mail**
   - Enviar newsletters para profissionais cadastrados
   - Avisar sobre novos recursos
   - Pedir feedback

3. **📊 Análises de Mercado**
   - Quais profissões são mais procuradas
   - Quais regiões têm mais cadastros
   - Horários de pico de cadastros

4. **🎯 Segmentação**
   - Criar grupos específicos por profissão
   - Campanhas direcionadas por região
   - Ações personalizadas

5. **📱 WhatsApp Marketing**
   - Criar listas de broadcast
   - Avisos sobre rankings no Google
   - Confirmações de publicação

---

## 🔐 **Segurança**

- ✅ Os dados estão armazenados no PostgreSQL (Neon Database)
- ✅ Backups automáticos pelo Replit
- ✅ Conexão criptografada
- ✅ Apenas você tem acesso (não é público)

---

## ❓ **Precisa de Ajuda?**

**Para consultas específicas, me pergunte:**
- "Me mostre os últimos 20 cadastros"
- "Quantos advogados temos no RJ?"
- "Lista de todos os eletricistas de SP"
- "Quais as profissões mais cadastradas?"

**Quer exportar dados?**
- "Exporta todos os cadastros em CSV"
- "Me dá uma lista de WhatsApps de advogados"

**Quer criar novas funcionalidades?**
- "Cria uma página de admin"
- "Adiciona filtro por data de cadastro"
- "Cria relatório mensal"

---

## 🚀 **Próximos Passos**

Agora você pode:
1. ✅ Acessar todos os dados pelo Tools > Database
2. ✅ Usar os endpoints de API acima
3. ✅ Pedir análises e consultas específicas
4. ✅ Exportar dados quando precisar
5. ✅ Criar novas funcionalidades baseadas nos dados

**Me diga: que tipo de consulta ou análise você gostaria de fazer primeiro?** 🎯
