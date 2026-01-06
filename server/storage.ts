import { type Contact, type InsertContact, contacts, type Testimonial, type InsertTestimonial, testimonials, type Prestador, type InsertPrestador, prestadores, type User, type InsertUser, users, type City, type InsertCity, cities, type Profession, type InsertProfession, professions, type TermsOfUse, type InsertTermsOfUse, termsOfUse } from "@shared/schema";
import { db, pool } from "./db";
import { eq, or, like, sql, desc, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Export db for use in routes
export { db };

export interface QueryPrestadoresOptions {
  limit?: number;
  offset?: number;
  estado?: string;
  profissao?: string;
}

export interface DatabaseStats {
  totalPrestadores: number;
  totalContacts: number;
  totalTestimonials: number;
  totalTestimonialsApproved: number;
  professionStats: { profession: string; count: number }[];
  stateStats: { state: string; count: number }[];
}

export interface IStorage {
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // Testimonials
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  getAllTestimonials(): Promise<Testimonial[]>;
  approveTestimonial(id: string): Promise<Testimonial | null>;
  
  // Prestadores
  createPrestador(prestador: InsertPrestador, serialNumber: number, ip: string): Promise<Prestador>;
  getPrestadores(): Promise<Prestador[]>;
  queryPrestadores(options: QueryPrestadoresOptions): Promise<Prestador[]>;
  getPrestadorBySerial(serialNumber: number): Promise<Prestador | null>;
  getStats(): Promise<DatabaseStats>;
  
  // Users (Authentication)
  createUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUser(id: number): Promise<User | null>;
  
  // Cities (Admin Management)
  createCity(city: InsertCity): Promise<City>;
  getCities(): Promise<City[]>;
  getActiveCities(): Promise<City[]>;
  getCitiesByState(state: string): Promise<City[]>;
  updateCity(id: number, city: Partial<InsertCity>): Promise<City | null>;
  deleteCity(id: number): Promise<boolean>;
  toggleCityStatus(id: number): Promise<City | null>;
  
  // Professions (Admin Management)
  createProfession(profession: InsertProfession): Promise<Profession>;
  getProfessions(): Promise<Profession[]>;
  getActiveProfessions(): Promise<Profession[]>;
  updateProfession(id: number, profession: Partial<InsertProfession>): Promise<Profession | null>;
  deleteProfession(id: number): Promise<boolean>;
  toggleProfessionStatus(id: number): Promise<Profession | null>;
  
  // Terms of Use (Admin Management)
  getTermsOfUse(): Promise<TermsOfUse | null>;
  createTermsOfUse(content: string, userId?: number): Promise<TermsOfUse>;
  updateTermsOfUse(content: string, userId: number): Promise<TermsOfUse>;
  
  // Session Store
  sessionStore: session.Store;
}

export class PostgresStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    // Use the same pool from db.ts (Neon connection)
    this.sessionStore = new PostgresSessionStore({ 
      pool: pool,
      createTableIfMissing: true 
    });
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values({
      ...insertContact,
      email: insertContact.email || null,
      message: insertContact.message || null,
    }).returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values({
      ...insertTestimonial,
    }).returning();
    return testimonial;
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.isApproved, 1));
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async approveTestimonial(id: string): Promise<Testimonial | null> {
    const [updated] = await db
      .update(testimonials)
      .set({ isApproved: 1 })
      .where(eq(testimonials.id, id))
      .returning();
    return updated || null;
  }

  async createPrestador(insertPrestador: InsertPrestador, serialNumber: number, ip: string): Promise<Prestador> {
    const [prestador] = await db.insert(prestadores).values({
      ...insertPrestador,
      email: insertPrestador.email || null,
      names: insertPrestador.names || null,
      serial_number: serialNumber,
      ip: ip,
    }).returning();
    return prestador;
  }

  async getPrestadores(): Promise<Prestador[]> {
    return await db.select().from(prestadores).orderBy(desc(prestadores.createdAt));
  }

  async queryPrestadores(options: QueryPrestadoresOptions): Promise<Prestador[]> {
    const { limit = 50, offset = 0, estado, profissao } = options;
    
    let query = db.select().from(prestadores);
    
    // Build filter conditions using Drizzle helpers
    const conditions = [];
    
    if (estado) {
      conditions.push(eq(prestadores.dropdown_2, estado));
    }
    
    if (profissao) {
      conditions.push(
        or(
          like(prestadores.multi_select, `%${profissao}%`),
          like(prestadores.multi_select_2, `%${profissao}%`),
          like(prestadores.multi_select_1, `%${profissao}%`)
        )
      );
    }
    
    // Apply combined conditions properly using Drizzle's and() helper
    if (conditions.length > 0) {
      query = query.where(
        conditions.length === 1 ? conditions[0] : and(...conditions)
      ) as any;
    }
    
    return await query
      .orderBy(desc(prestadores.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getPrestadorBySerial(serialNumber: number): Promise<Prestador | null> {
    const [prestador] = await db
      .select()
      .from(prestadores)
      .where(eq(prestadores.serial_number, serialNumber));
    return prestador || null;
  }

  async getStats(): Promise<DatabaseStats> {
    // Get total counts
    const totalPrestadores = await db.select({ count: sql<number>`count(*)` }).from(prestadores);
    const totalContactsResult = await db.select({ count: sql<number>`count(*)` }).from(contacts);
    const totalTestimonialsResult = await db.select({ count: sql<number>`count(*)` }).from(testimonials);
    const totalTestimonialsApprovedResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(testimonials)
      .where(eq(testimonials.isApproved, 1));

    // Get profession statistics (from first profession field)
    const professionStatsRaw = await db
      .select({
        profession: prestadores.multi_select,
        count: sql<number>`count(*)`,
      })
      .from(prestadores)
      .groupBy(prestadores.multi_select)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Get state statistics
    const stateStatsRaw = await db
      .select({
        state: prestadores.dropdown_2,
        count: sql<number>`count(*)`,
      })
      .from(prestadores)
      .groupBy(prestadores.dropdown_2)
      .orderBy(desc(sql`count(*)`));

    return {
      totalPrestadores: Number(totalPrestadores[0]?.count || 0),
      totalContacts: Number(totalContactsResult[0]?.count || 0),
      totalTestimonials: Number(totalTestimonialsResult[0]?.count || 0),
      totalTestimonialsApproved: Number(totalTestimonialsApprovedResult[0]?.count || 0),
      professionStats: professionStatsRaw
        .filter(p => p.profession)
        .map(p => ({ 
          profession: p.profession!, 
          count: Number(p.count) 
        })),
      stateStats: stateStatsRaw
        .filter(s => s.state)
        .map(s => ({ 
          state: s.state!, 
          count: Number(s.count) 
        })),
    };
  }

  // ===== AUTHENTICATION (USERS) =====
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async getUser(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  // ===== CITIES MANAGEMENT =====
  
  async createCity(insertCity: InsertCity): Promise<City> {
    const [city] = await db.insert(cities).values({
      ...insertCity,
      state: insertCity.state.toUpperCase(),
    }).returning();
    return city;
  }

  async getCities(): Promise<City[]> {
    return await db.select().from(cities).orderBy(cities.state, cities.name);
  }

  async getActiveCities(): Promise<City[]> {
    return await db.select().from(cities)
      .where(eq(cities.isActive, 1))
      .orderBy(cities.state, cities.name);
  }

  async getCitiesByState(state: string): Promise<City[]> {
    return await db.select().from(cities)
      .where(and(
        eq(cities.state, state.toUpperCase()),
        eq(cities.isActive, 1)
      ))
      .orderBy(cities.name);
  }

  async updateCity(id: number, updateData: Partial<InsertCity>): Promise<City | null> {
    const [updated] = await db
      .update(cities)
      .set({
        ...updateData,
        state: updateData.state ? updateData.state.toUpperCase() : undefined,
      })
      .where(eq(cities.id, id))
      .returning();
    return updated || null;
  }

  async deleteCity(id: number): Promise<boolean> {
    const result = await db.delete(cities).where(eq(cities.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async toggleCityStatus(id: number): Promise<City | null> {
    const [city] = await db.select().from(cities).where(eq(cities.id, id));
    if (!city) return null;
    
    const [updated] = await db
      .update(cities)
      .set({ isActive: city.isActive === 1 ? 0 : 1 })
      .where(eq(cities.id, id))
      .returning();
    return updated || null;
  }

  // ===== PROFESSIONS MANAGEMENT =====
  
  async createProfession(insertProfession: InsertProfession): Promise<Profession> {
    const [profession] = await db.insert(professions).values(insertProfession).returning();
    return profession;
  }

  async getProfessions(): Promise<Profession[]> {
    return await db.select().from(professions).orderBy(professions.name);
  }

  async getActiveProfessions(): Promise<Profession[]> {
    return await db.select().from(professions)
      .where(eq(professions.isActive, 1))
      .orderBy(professions.name);
  }

  async updateProfession(id: number, updateData: Partial<InsertProfession>): Promise<Profession | null> {
    const [updated] = await db
      .update(professions)
      .set(updateData)
      .where(eq(professions.id, id))
      .returning();
    return updated || null;
  }

  async deleteProfession(id: number): Promise<boolean> {
    const result = await db.delete(professions).where(eq(professions.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async toggleProfessionStatus(id: number): Promise<Profession | null> {
    const [profession] = await db.select().from(professions).where(eq(professions.id, id));
    if (!profession) return null;
    
    const [updated] = await db
      .update(professions)
      .set({ isActive: profession.isActive === 1 ? 0 : 1 })
      .where(eq(professions.id, id))
      .returning();
    return updated || null;
  }

  // ===== TERMS OF USE MANAGEMENT =====
  
  async getTermsOfUse(): Promise<TermsOfUse | null> {
    const [terms] = await db.select().from(termsOfUse).limit(1);
    return terms || null;
  }

  async createTermsOfUse(content: string, userId?: number): Promise<TermsOfUse> {
    const [terms] = await db.insert(termsOfUse).values({
      content,
      updatedBy: userId || null,
    }).returning();
    return terms;
  }

  async updateTermsOfUse(content: string, userId: number): Promise<TermsOfUse> {
    // Primeiro tenta atualizar o registro existente
    const existing = await this.getTermsOfUse();
    
    if (existing) {
      const [updated] = await db
        .update(termsOfUse)
        .set({
          content,
          updatedBy: userId,
          updatedAt: sql`now()`,
        })
        .where(eq(termsOfUse.id, existing.id))
        .returning();
      return updated;
    } else {
      // Se não existir, cria um novo
      return await this.createTermsOfUse(content, userId);
    }
  }
}

export const storage = new PostgresStorage();
