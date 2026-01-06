# 🌐 Como Conectar o Domínio busca.social.br ao Replit

## ⚠️ IMPORTANTE: Cloudflare e Replit
**ATENÇÃO:** O Replit **NÃO suporta** Cloudflare Proxy (nuvem laranja 🟧).
- ✅ Você DEVE usar DNS direto (nuvem cinza ☁️)
- ❌ Não use Cloudflare Proxy, pois impede renovação automática de certificados SSL

---

## 📋 Passo a Passo para Conectar o Domínio

### 1. Publicar o Site no Replit
1. Clique no botão **"Deploy"** (Publicar) no topo do Replit
2. Configure o deployment para produção
3. Aguarde o site ser publicado (você receberá uma URL `.replit.app`)

### 2. Obter Configurações DNS do Replit
1. Após publicar, vá em **Deployments → Settings → Domains**
2. Clique em **"Link a domain"** ou **"Manually connect from another registrar"**
3. O Replit fornecerá:
   - **A Record** (ex: `76.223.126.88`)
   - **TXT Record** para verificação (ex: `replit-verify=abc123def456...`)

### 3. Configurar DNS no Seu Registrador de Domínio

#### Se estiver usando Cloudflare:
1. Acesse o painel do Cloudflare
2. Vá em **DNS → Records**
3. Adicione/Edite os registros:

```
🌐 DOMÍNIO COMPLETO: busca.social.br (extensão: .social.br)

Tipo: A
Nome: busca.social.br (ou @ para root domain)
Conteúdo: [IP fornecido pelo Replit, ex: 76.223.126.88]
Proxy: ☁️ DNS only (CINZA) - NÃO USE 🟧 Proxied!
TTL: Auto

Tipo: TXT
Nome: busca.social.br (ou @ para root domain)
Conteúdo: [Código de verificação do Replit]
TTL: Auto
```

4. **CRUCIAL:** Certifique-se que o status está **☁️ DNS only (cinza)**, NÃO 🟧 Proxied (laranja)

#### Se estiver usando outro Registrador (Registro.br, GoDaddy, etc.):
1. Acesse o painel DNS do seu registrador
2. Adicione os registros:

```
🌐 DOMÍNIO COMPLETO: busca.social.br (extensão: .social.br)

Tipo: A
Host/Nome: busca.social.br (ou @ se for root domain)
Valor/Endereço: [IP fornecido pelo Replit]

Tipo: TXT
Host/Nome: busca.social.br (ou @ se for root domain)
Valor: [Código de verificação do Replit]
```

### 4. Aguardar Propagação DNS
- ⏱️ **Tempo:** 5 minutos a 48 horas (geralmente 30 min - 2 horas)
- 🔍 **Verificar propagação:** Use https://dnschecker.org
  - Digite `busca.social.br`
  - Tipo: `A`
  - Verifique se o IP aparece em várias regiões

### 5. Configurar SSL/HTTPS no Replit
- ✅ O Replit configura automaticamente SSL (Let's Encrypt)
- ⚡ Certificado é renovado automaticamente
- 🔒 Seu site ficará acessível via `https://busca.social.br`

---

## 🔍 Otimizações SEO Já Implementadas

### ✅ Meta Tags Otimizadas
- **Título SEO:** Inclui todas as cidades (Valença, Barra do Piraí, Volta Redonda, Vassouras, Conservatória RJ)
- **Description:** 155 caracteres otimizados com palavras-chave
- **Keywords:** Profissionais + cidades RJ
- **Canonical URL:** https://busca.social.br
- **Open Graph:** Facebook, Twitter Card para redes sociais

### ✅ Schema.org (Rich Snippets)
1. **LocalBusiness Schema:** Dados estruturados do negócio com 5 cidades atendidas
2. **FAQPage Schema:** 5 perguntas do FAQ indexadas
3. **Service Schema:** Descrição do serviço de cadastro

### ✅ Arquivos SEO
- **robots.txt:** Configurado para Google, Bing e crawlers
- **sitemap.xml:** URLs principais + seções (#categorias, #faq, #feedback)

### ✅ Headers HTTP para Crawlers
- **X-Robots-Tag:** index, follow, max-image-preview:large
- **Cache-Control:** Otimizado para crawlers (24h para sitemap/robots)

---

## 📊 Após Conectar o Domínio

### 1. Verificar no Google Search Console
1. Acesse https://search.google.com/search-console
2. Adicione a propriedade `busca.social.br`
3. Método de verificação: **Tag HTML** ou **Arquivo HTML**
4. Envie o sitemap: `https://busca.social.br/sitemap.xml`

### 2. Verificar no Bing Webmaster Tools
1. Acesse https://www.bing.com/webmasters
2. Adicione o site `busca.social.br`
3. Método de verificação: **Meta tag** (adicione o código em `index.html`)
4. Envie o sitemap: `https://busca.social.br/sitemap.xml`

### 3. Testar Indexação
- **Google:** `site:busca.social.br`
- **Bing:** `site:busca.social.br`
- **Rich Results Test:** https://search.google.com/test/rich-results
  - Teste: `https://busca.social.br`
  - Verifique se os schemas aparecem corretamente

---

## 🎯 Cidades-alvo para SEO

As seguintes cidades estão otimizadas no SEO:
- ✅ Valença RJ
- ✅ Barra do Piraí RJ
- ✅ Volta Redonda RJ
- ✅ Vassouras RJ
- ✅ Conservatória RJ

**Schema LocalBusiness** inclui todas essas cidades no `areaServed`.

---

## 🚨 Solução de Problemas

### Domínio não funciona após 48h
- ✅ Verifique se o registro A está correto
- ✅ Confirme que NÃO está usando Cloudflare Proxy
- ✅ Teste com `nslookup busca.social.br`
- ✅ Verifique logs no Replit Deployments

### SSL não funciona
- ❌ Provavelmente Cloudflare Proxy está ativado
- ✅ Desative o proxy (deixe cinza ☁️)
- ⏱️ Aguarde 10-30 min para renovação do certificado

### Crawlers não encontram o site
- ✅ Verifique robots.txt: `https://busca.social.br/robots.txt`
- ✅ Verifique sitemap: `https://busca.social.br/sitemap.xml`
- ✅ Envie sitemap no Google Search Console
- ✅ Teste com: https://search.google.com/test/rich-results

---

## 📞 Suporte

- **Replit Docs:** https://docs.replit.com/hosting/deployments/custom-domains
- **Google Search Console:** https://search.google.com/search-console
- **Bing Webmaster:** https://www.bing.com/webmasters

---

**✅ Seu site está 100% otimizado para SEO e pronto para conectar ao domínio busca.social.br!**
