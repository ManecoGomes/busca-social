import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./storage";
import { sql } from "drizzle-orm";
import { insertContactSchema, insertTestimonialSchema, insertPrestadorSchema, insertCitySchema, insertProfessionSchema, insertTermsOfUseSchema } from "@shared/schema";
import { getNextSerialNumber } from "./serial-counter";
import { sendRegistrationEmails, testEmailConnection } from "./email";
import { setupAuth, hashPassword } from "./auth";
import { PROFISSOES } from "../client/src/data/cadastro-data";

interface GoogleReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlacesResponse {
  result?: {
    reviews?: GoogleReview[];
    rating?: number;
    user_ratings_total?: number;
  };
  status: string;
}

// Middleware to check if user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication (creates /api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Initialize admin user if doesn't exist
  async function initializeAdmin() {
    const existingAdmin = await storage.getUserByEmail("manecogomes@gmail.com");
    if (!existingAdmin) {
      console.log("[Setup] Creating initial admin user...");
      const hashedPassword = await hashPassword("@!Md887400@!");
      await storage.createUser({
        username: "manecogomes",
        email: "manecogomes@gmail.com",
        password: hashedPassword,
      });
      console.log("[Setup] ✅ Admin user created successfully!");
      console.log("[Setup] Email: manecogomes@gmail.com");
    } else {
      console.log("[Setup] ✅ Admin user already exists");
    }
  }

  // Ensure terms_of_use table exists
  async function ensureTermsOfUseTable() {
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS terms_of_use (
          id serial PRIMARY KEY,
          content text NOT NULL,
          updated_by integer REFERENCES users(id) ON DELETE SET NULL,
          updated_at timestamp with time zone NOT NULL DEFAULT now()
        )
      `);
      console.log("[Setup] ✅ terms_of_use table ensured");
    } catch (err: any) {
      console.error("[Setup] Failed to ensure terms_of_use table:", err.message);
      throw err;
    }
  }

  // Ensure accepted_terms column exists in prestadores table
  async function ensureAcceptedTermsColumn() {
    try {
      await db.execute(sql`
        ALTER TABLE prestadores 
        ADD COLUMN IF NOT EXISTS accepted_terms integer DEFAULT 1
      `);
      console.log("[Setup] ✅ accepted_terms column ensured in prestadores table");
    } catch (err: any) {
      console.error("[Setup] Failed to ensure accepted_terms column:", err.message);
      throw err;
    }
  }

  // Initialize professions from static file (runs on every server start)
  async function initializeProfessions() {
    try {
      const existingProfessions = await storage.getProfessions();
      const existingCount = existingProfessions.length;
      
      console.log(`[Setup] Current professions in database: ${existingCount}`);
      
      // If there are fewer than 500 professions, load all from file
      if (existingCount < 500) {
        console.log(`[Setup] Loading ${PROFISSOES.length} professions from file...`);
        
        const existingNames = new Set(existingProfessions.map(p => p.name.toLowerCase()));
        let added = 0;
        let skipped = 0;
        
        for (const professionName of PROFISSOES) {
          if (existingNames.has(professionName.toLowerCase())) {
            skipped++;
            continue;
          }
          
          try {
            await storage.createProfession({ name: professionName });
            existingNames.add(professionName.toLowerCase());
            added++;
          } catch (err: any) {
            console.error(`[Setup] Error adding profession "${professionName}":`, err.message);
          }
        }
        
        console.log(`[Setup] ✅ Professions initialized! Added: ${added}, Skipped: ${skipped}`);
      } else {
        console.log(`[Setup] ✅ Professions already initialized (${existingCount} found)`);
      }
    } catch (err: any) {
      console.error("[Setup] Failed to initialize professions:", err.message);
    }
  }

  // Initialize terms of use with default content
  async function initializeTermsOfUse() {
    await ensureTermsOfUseTable();
    await ensureAcceptedTermsColumn();
    const existingTerms = await storage.getTermsOfUse();
    if (!existingTerms) {
      console.log("[Setup] Creating initial Terms of Use...");
      const defaultContent = `# Termos de Uso — Busca Social / Maneco Gomes

## 1. Apresentação

Bem-vindo(a) aos sites busca.social.br e manecogomes.com.br ("nossos sites").
Essas plataformas têm como objetivo facilitar o contato entre pessoas que precisam de serviços e prestadores que desejam ser encontrados.
Ao utilizar nossos sites, seja como usuário ou prestador, você declara que leu, entendeu e concorda com estes Termos de Uso.

## 2. Função do Serviço

Nosso papel é apenas intermediar informações — nós não contratamos, indicamos ou garantimos nenhum prestador específico.
Os sites não recebem comissão, pagamento nem participam de qualquer negociação entre usuários e prestadores.
Toda contratação é feita diretamente entre as partes, sem envolvimento operacional, financeiro ou jurídico da plataforma.

## 3. Para Usuários (quem busca serviços)

- O usuário pode consultar gratuitamente os contatos dos prestadores divulgados.
- A escolha do profissional é de inteira responsabilidade do usuário.
- A plataforma não garante qualidade, preço ou prazo dos serviços prestados.
- Recomendamos que o usuário avalie cuidadosamente o prestador antes de qualquer contratação.
- O uso do serviço implica que o usuário reconhece o papel meramente informativo da plataforma.

## 4. Para Prestadores (quem se cadastra)

O prestador, ao se cadastrar em nossos sites, declara que:

- As informações fornecidas (como nome, telefone, e-mail, descrição e endereço comercial) são verdadeiras e atualizadas;
- Autoriza a divulgação pública desses dados para fins de contato com potenciais clientes;
- Compreende que a inclusão no site não representa recomendação nem parceria comercial com a imobiliária ou os administradores da plataforma;
- Reconhece que é o único responsável pelos serviços que oferece e pelas informações disponibilizadas.

Fazemos uma verificação básica para manter a integridade do cadastro, mas não garantimos a exatidão completa das informações fornecidas pelos prestadores.

## 5. Limitação de Responsabilidade

A plataforma, seus administradores e parceiros não se responsabilizam por:

- danos, prejuízos ou insatisfações decorrentes de serviços contratados entre usuários e prestadores;
- informações incorretas ou desatualizadas publicadas por terceiros;
- eventuais indisponibilidades técnicas ou falhas temporárias do site.

O uso do serviço implica a aceitação total desses limites de responsabilidade.

## 6. Atualizações dos Termos

Podemos alterar estes Termos de Uso a qualquer momento, sempre visando maior clareza e segurança jurídica.
Recomendamos que usuários e prestadores revisem esta página periodicamente.
A continuação do uso dos sites após mudanças significa aceitação das novas condições.

## 7. Contato

Dúvidas, sugestões ou pedidos de atualização cadastral podem ser enviados pelo formulário disponível nos sites ou pelo e-mail de contato informado na página principal.

## 8. Encerramento

Nosso compromisso é manter um ambiente de transparência, utilidade e confiança, conectando pessoas e soluções de forma prática, ética e segura.
Ao continuar navegando em nossos sites, você confirma sua concordância com estes Termos.`;
      
      await storage.createTermsOfUse(defaultContent);
      console.log("[Setup] ✅ Terms of Use created successfully!");
    } else {
      console.log("[Setup] ✅ Terms of Use already exist");
    }
  }

  // Initialize admin user (runs once on server start)
  initializeAdmin().catch(err => console.error("[Setup] Failed to initialize admin:", err));
  
  // Initialize professions from file (runs on every server start)
  initializeProfessions().catch(err => console.error("[Setup] Failed to initialize professions:", err));
  
  // Initialize terms of use (runs once on server start)
  initializeTermsOfUse().catch(err => console.error("[Setup] Failed to initialize terms:", err));

  // Contact form endpoint for lead capture
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  // Get all contacts (admin only)
  app.get("/api/contacts", requireAuth, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Create testimonial (needs approval before appearing on site)
  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.json(testimonial);
    } catch (error) {
      res.status(400).json({ error: "Invalid testimonial data" });
    }
  });

  // Get approved testimonials for public display
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getApprovedTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Approve a testimonial (admin endpoint)
  app.patch("/api/testimonials/:id/approve", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const testimonial = await storage.approveTestimonial(id);
      if (!testimonial) {
        res.status(404).json({ error: "Testimonial not found" });
        return;
      }
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve testimonial" });
    }
  });

  // Get Google Reviews for Maneco Gomes Empreendimentos
  app.get("/api/google-reviews", async (req, res) => {
    try {
      const placeId = "ChIJY9ft-H8pmQAR-KQQF4uyT8c";
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;

      console.log("[Google Reviews] API Key present:", !!apiKey);
      console.log("[Google Reviews] Place ID:", placeId);

      if (!apiKey) {
        console.error("[Google Reviews] API key not configured");
        return res.status(500).json({ error: "Google Places API key not configured" });
      }

      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=pt-BR`;
      console.log("[Google Reviews] Fetching from Google API...");
      
      const response = await fetch(url);
      const data = await response.json() as GooglePlacesResponse;

      console.log("[Google Reviews] API Status:", data.status);
      console.log("[Google Reviews] Reviews count:", data.result?.reviews?.length || 0);

      if (data.status !== "OK") {
        console.error("[Google Reviews] API error:", data.status, data);
        return res.status(500).json({ error: `Google API error: ${data.status}`, details: data });
      }

      const reviews = data.result?.reviews || [];
      const formattedReviews = reviews.slice(0, 3).map(review => ({
        name: review.author_name,
        rating: review.rating,
        testimony: review.text,
        time: review.relative_time_description,
        profilePhoto: review.profile_photo_url,
        authorUrl: review.author_url,
      }));

      const result = {
        reviews: formattedReviews,
        averageRating: data.result?.rating || 0,
        totalReviews: data.result?.user_ratings_total || 0,
      };

      console.log("[Google Reviews] Returning:", formattedReviews.length, "reviews");
      return res.json(result);
    } catch (error) {
      console.error("[Google Places API error]:", error);
      return res.status(500).json({ error: "Failed to fetch Google reviews", details: String(error) });
    }
  });

  // Prestadores form endpoint with dual webhook support
  app.post("/api/prestadores", async (req, res) => {
    try {
      // Honeypot field check (simple anti-spam)
      if (req.body.website) {
        // Bot filled the honeypot field
        return res.status(400).json({ error: "Invalid submission" });
      }

      const validatedData = insertPrestadorSchema.parse(req.body);

      // Generate automatic fields
      const serialNumber = getNextSerialNumber();
      const userIp = req.headers['x-forwarded-for'] as string || 
                     req.headers['x-real-ip'] as string || 
                     req.socket.remoteAddress || 
                     'unknown';
      
      // Clean IP (in case of multiple IPs in x-forwarded-for)
      const ip = Array.isArray(userIp) ? userIp[0] : userIp.split(',')[0].trim();

      // Format WhatsApp with Brazilian format: +55(XX)XXXXXXXXX
      let cleanWhatsApp = validatedData.input_mask_3.replace(/\D/g, ''); // Remove all non-digits
      
      // Remove +55 country code if user typed it (avoid duplication: +55(55)...)
      // Valid Brazilian phone: DDD (2 digits) + number (8 or 9 digits) = 10 or 11 digits total
      // With country code: 55 + 10 or 11 = 12 or 13 digits
      if (cleanWhatsApp.startsWith('55') && (cleanWhatsApp.length === 12 || cleanWhatsApp.length === 13)) {
        // Verify it's actually country code by checking if removing it leaves valid length
        const withoutCode = cleanWhatsApp.substring(2);
        if (withoutCode.length === 10 || withoutCode.length === 11) {
          cleanWhatsApp = withoutCode; // Remove the country code
        }
      }
      
      // Strict validation: reject if too many or too few digits
      if (cleanWhatsApp.length < 10 || cleanWhatsApp.length > 11) {
        throw new Error(`WhatsApp inválido: digite apenas DDD + número (10 ou 11 dígitos). Recebido: ${cleanWhatsApp.length} dígitos`);
      }
      
      // Extract DDD (area code) - first 2 digits
      const ddd = cleanWhatsApp.substring(0, 2);
      // Extract phone number (remaining digits)
      let phoneNumber = cleanWhatsApp.substring(2);
      
      // If phone has only 8 digits, add 9 at the beginning (9th digit rule)
      if (phoneNumber.length === 8) {
        phoneNumber = '9' + phoneNumber;
      }
      
      // Final validation: phone number must have exactly 9 digits after processing
      if (phoneNumber.length !== 9) {
        throw new Error(`WhatsApp inválido: número deve ter 8 ou 9 dígitos (recebido: ${phoneNumber.length})`);
      }
      
      // Format: +55(XX)XXXXXXXXX
      const whatsappWithCountryCode = `+55(${ddd})${phoneNumber}`;

      console.log(`[Prestador Submission] Serial: ${serialNumber}, IP: ${ip}, WhatsApp: ${whatsappWithCountryCode}`);

      // Send to both webhooks in parallel (ALWAYS, even if DB fails)
      const webhookProduction = "https://n8n.maneco.net.br/webhook/cadastroPrestadores2201";
      const webhookTest = "https://n8n.maneco.net.br/webhook-test/cadastroPrestadores2201";

      const webhookPayload = {
        ...validatedData,
        input_mask_3: whatsappWithCountryCode, // Override with formatted number
        submission: {
          serial_number: serialNumber,
          ip: ip,
          accepted_terms: true, // Usuário aceitou os Termos de Uso
        },
        submittedAt: new Date().toISOString(),
      };

      // Send to both webhooks without waiting (fire and forget)
      const webhookPromises = Promise.all([
        fetch(webhookProduction, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        }).then(response => {
          console.log("[Webhook Production] Status:", response.status);
          return response;
        }).catch(err => console.error("[Webhook Production Error]:", err)),
        
        fetch(webhookTest, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        }).then(response => {
          console.log("[Webhook Test] Status:", response.status);
          return response;
        }).catch(err => console.error("[Webhook Test Error]:", err)),
      ]);

      // Try to save to database (but don't fail if it errors)
      let prestadorId = null;
      try {
        const prestador = await storage.createPrestador(validatedData, serialNumber, ip);
        prestadorId = prestador.id;
        console.log("[Database] Saved successfully with ID:", prestadorId);
      } catch (dbError: any) {
        console.warn("[Database] Save failed (non-critical):", dbError.message);
        // Continue anyway - webhooks are more important
      }

      // Wait for webhooks to complete
      await webhookPromises;

      // Send confirmation emails (non-blocking - fire and forget)
      const emailData = {
        ...validatedData,
        input_mask_3: whatsappWithCountryCode,
        serial_number: serialNumber,
        ip: ip,
      };
      
      sendRegistrationEmails(emailData, validatedData.email).catch(err => {
        console.error("[Email Error] Failed to send confirmation emails:", err);
      });

      res.json({ 
        success: true, 
        id: prestadorId,
        serialNumber: serialNumber,
        message: "Cadastro enviado com sucesso! Você receberá um retorno em breve."
      });
    } catch (error: any) {
      console.error("[Prestador submission error]:", error);
      res.status(400).json({ 
        error: "Dados inválidos", 
        details: error?.issues || error?.message 
      });
    }
  });

  // Get all prestadores (admin only - for monitoring)
  app.get("/api/prestadores", requireAuth, async (req, res) => {
    try {
      const prestadores = await storage.getPrestadores();
      res.json(prestadores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prestadores" });
    }
  });

  // Get prestadores with pagination and filters (for database access)
  app.get("/api/prestadores/query", requireAuth, async (req, res) => {
    try {
      const { limit = '50', offset = '0', estado, profissao } = req.query;
      const prestadores = await storage.queryPrestadores({
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        estado: estado as string,
        profissao: profissao as string,
      });
      res.json(prestadores);
    } catch (error) {
      res.status(500).json({ error: "Failed to query prestadores" });
    }
  });

  // Get prestador by serial number
  app.get("/api/prestadores/serial/:serialNumber", requireAuth, async (req, res) => {
    try {
      const { serialNumber } = req.params;
      const prestador = await storage.getPrestadorBySerial(parseInt(serialNumber));
      if (!prestador) {
        return res.status(404).json({ error: "Prestador not found" });
      }
      res.json(prestador);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prestador" });
    }
  });

  // Get database statistics (for insights)
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Test email configuration
  app.get("/api/test-email", requireAuth, async (req, res) => {
    try {
      const isConnected = await testEmailConnection();
      res.json({ 
        success: isConnected, 
        message: isConnected ? "SMTP connection successful" : "SMTP connection failed" 
      });
    } catch (error) {
      res.status(500).json({ error: "Email test failed" });
    }
  });

  // ===== CITIES ADMIN ROUTES =====
  
  // Get all cities (admin only)
  app.get("/api/admin/cities", requireAuth, async (req, res) => {
    try {
      const cities = await storage.getCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  // Create new city (admin only)
  app.post("/api/admin/cities", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCitySchema.parse(req.body);
      const city = await storage.createCity(validatedData);
      res.status(201).json(city);
    } catch (error: any) {
      res.status(400).json({ 
        error: "Invalid city data", 
        details: error?.issues || error?.message 
      });
    }
  });

  // Update city (admin only)
  app.patch("/api/admin/cities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const city = await storage.updateCity(id, req.body);
      if (!city) {
        return res.status(404).json({ error: "City not found" });
      }
      res.json(city);
    } catch (error) {
      res.status(400).json({ error: "Failed to update city" });
    }
  });

  // Delete city (admin only)
  app.delete("/api/admin/cities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCity(id);
      if (!success) {
        return res.status(404).json({ error: "City not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete city" });
    }
  });

  // Toggle city status (admin only)
  app.post("/api/admin/cities/:id/toggle", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const city = await storage.toggleCityStatus(id);
      if (!city) {
        return res.status(404).json({ error: "City not found" });
      }
      res.json(city);
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle city status" });
    }
  });

  // ===== PROFESSIONS ROUTES =====
  
  // DEBUG: Search professions by partial name
  app.get("/api/professions/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const allProfessions = await storage.getProfessions();
      const results = allProfessions.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      res.json({ 
        query, 
        total: results.length,
        results 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to search professions" });
    }
  });
  
  // Get active professions (public endpoint for cadastro form)
  app.get("/api/professions", async (req, res) => {
    try {
      const professions = await storage.getActiveProfessions();
      res.json(professions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch professions" });
    }
  });
  
  // ===== PROFESSIONS ADMIN ROUTES =====
  
  // Get all professions (admin only)
  app.get("/api/admin/professions", requireAuth, async (req, res) => {
    try {
      const professions = await storage.getProfessions();
      res.json(professions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch professions" });
    }
  });

  // Create new profession (admin only)
  app.post("/api/admin/professions", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProfessionSchema.parse(req.body);
      const profession = await storage.createProfession(validatedData);
      res.status(201).json(profession);
    } catch (error: any) {
      res.status(400).json({ 
        error: "Invalid profession data", 
        details: error?.issues || error?.message 
      });
    }
  });

  // Update profession (admin only)
  app.patch("/api/admin/professions/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const profession = await storage.updateProfession(id, req.body);
      if (!profession) {
        return res.status(404).json({ error: "Profession not found" });
      }
      res.json(profession);
    } catch (error) {
      res.status(400).json({ error: "Failed to update profession" });
    }
  });

  // Delete profession (admin only)
  app.delete("/api/admin/professions/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProfession(id);
      if (!success) {
        return res.status(404).json({ error: "Profession not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete profession" });
    }
  });

  // Toggle profession status (admin only)
  app.post("/api/admin/professions/:id/toggle", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const profession = await storage.toggleProfessionStatus(id);
      if (!profession) {
        return res.status(404).json({ error: "Profession not found" });
      }
      res.json(profession);
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle profession status" });
    }
  });

  // Migrate professions from static list to database (admin only, one-time use)
  app.post("/api/admin/professions/migrate", requireAuth, async (req, res) => {
    try {
      const { professions } = req.body;
      
      if (!Array.isArray(professions) || professions.length === 0) {
        return res.status(400).json({ error: "Professions array is required" });
      }

      console.log(`[Migration] Starting migration of ${professions.length} professions...`);
      
      // Get existing professions to avoid duplicates
      const existingProfessions = await storage.getProfessions();
      const existingNames = new Set(existingProfessions.map(p => p.name.toLowerCase()));
      
      let added = 0;
      let skipped = 0;
      
      for (const professionName of professions) {
        if (existingNames.has(professionName.toLowerCase())) {
          console.log(`[Migration] Skipping duplicate: ${professionName}`);
          skipped++;
          continue;
        }
        
        await storage.createProfession({ name: professionName });
        added++;
      }
      
      console.log(`[Migration] Complete! Added: ${added}, Skipped: ${skipped}`);
      
      res.json({ 
        success: true, 
        added, 
        skipped,
        total: professions.length 
      });
    } catch (error: any) {
      console.error('[Migration] Error:', error);
      res.status(500).json({ 
        error: "Failed to migrate professions",
        details: error?.message 
      });
    }
  });

  // Import professions from CSV/Excel file (admin only)
  app.post("/api/admin/professions/import", requireAuth, async (req, res) => {
    try {
      const { data, fileName } = req.body;
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: "Data array is required" });
      }

      console.log(`[Import] Starting import from file: ${fileName}`);
      console.log(`[Import] Rows to process: ${data.length}`);
      
      // Get existing professions to avoid duplicates
      const existingProfessions = await storage.getProfessions();
      const existingNames = new Set(existingProfessions.map(p => p.name.toLowerCase()));
      
      let added = 0;
      let skipped = 0;
      let errors = 0;
      const errorDetails: string[] = [];
      
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        
        // Try to extract profession name from different possible column names
        const professionName = row.nome || row.profissao || row.name || row.profession || 
                               row.Nome || row.Profissao || row.Name || row.Profession;
        
        if (!professionName || typeof professionName !== 'string' || professionName.trim() === '') {
          console.log(`[Import] Row ${i + 1}: Invalid data, skipping`);
          errors++;
          errorDetails.push(`Linha ${i + 1}: Nome de profissão inválido ou vazio`);
          continue;
        }
        
        const trimmedName = professionName.trim();
        
        if (existingNames.has(trimmedName.toLowerCase())) {
          console.log(`[Import] Row ${i + 1}: Skipping duplicate: ${trimmedName}`);
          skipped++;
          continue;
        }
        
        try {
          await storage.createProfession({ name: trimmedName });
          existingNames.add(trimmedName.toLowerCase()); // Add to set to avoid duplicates within the same import
          added++;
          console.log(`[Import] Row ${i + 1}: Added: ${trimmedName}`);
        } catch (err: any) {
          console.error(`[Import] Row ${i + 1}: Error adding ${trimmedName}:`, err.message);
          errors++;
          errorDetails.push(`Linha ${i + 1}: Erro ao adicionar "${trimmedName}" - ${err.message}`);
        }
      }
      
      console.log(`[Import] Complete! Added: ${added}, Skipped: ${skipped}, Errors: ${errors}`);
      
      res.json({ 
        success: true, 
        added, 
        skipped,
        errors,
        total: data.length,
        errorDetails: errorDetails.length > 0 ? errorDetails : undefined
      });
    } catch (error: any) {
      console.error('[Import] Error:', error);
      res.status(500).json({ 
        error: "Failed to import professions",
        details: error?.message 
      });
    }
  });

  // ===== TERMS OF USE ROUTES =====
  
  // Get terms of use (public endpoint)
  app.get("/api/terms-of-use", async (req, res) => {
    try {
      const terms = await storage.getTermsOfUse();
      if (!terms) {
        return res.status(404).json({ error: "Terms of Use not found" });
      }
      res.json(terms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch terms of use" });
    }
  });

  // Update terms of use (admin only)
  app.put("/api/admin/terms-of-use", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTermsOfUseSchema.parse(req.body);
      const userId = (req.user as any)?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found" });
      }
      
      const terms = await storage.updateTermsOfUse(validatedData.content, userId);
      res.json(terms);
    } catch (error: any) {
      console.error("[Terms Update Error]", error);
      res.status(400).json({ error: error?.message || "Failed to update terms of use" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
