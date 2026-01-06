import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  category: text("category").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  category: z.string().min(1, "Selecione uma categoria profissional"),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  profession: text("profession").notNull(),
  testimony: text("testimony").notNull(),
  rating: integer("rating").notNull().default(5),
  isApproved: integer("is_approved").notNull().default(0), // 0 = pending, 1 = approved
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  isApproved: true,
}).extend({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  profession: z.string().min(2, "Profissão deve ter pelo menos 2 caracteres"),
  testimony: z.string().min(10, "Depoimento deve ter pelo menos 10 caracteres"),
  rating: z.number().min(1).max(5),
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export const prestadores = pgTable("prestadores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Dados pessoais
  names: text("names"),
  email: text("email"),
  input_mask_3: text("input_mask_3").notNull(), // WhatsApp
  input_radio_1: text("input_radio_1").notNull(), // tipo de cadastro
  checkbox: text("checkbox").notNull(), // sexo
  numeric_field: text("numeric_field").notNull(), // CPF
  
  // Dados do negócio
  input_text: text("input_text").notNull(), // nome para divulgar
  input_radio: text("input_radio").notNull(), // quantas profissões
  multi_select: text("multi_select"), // serviço 1
  multi_select_2: text("multi_select_2"), // serviço 2
  multi_select_1: text("multi_select_1"), // serviço 3
  
  // Localização
  dropdown_2: text("dropdown_2").notNull(), // Estado
  dropdown_1: text("dropdown_1"), // Cidades RJ
  dropdown_3: text("dropdown_3"), // Cidades MG
  input_text_1: text("input_text_1").notNull(), // Logradouro
  
  // Descrição
  description: text("description").notNull(),
  
  // Campos automáticos
  serial_number: integer("serial_number").notNull(), // Número sequencial único
  ip: text("ip").notNull(), // IP do usuário
  accepted_terms: integer("accepted_terms").notNull().default(1), // 1 = aceitou os termos
  
  // Webhook status
  webhook_status: text("webhook_status").default("pending"), // pending, sent, failed
  webhook_test_status: text("webhook_test_status").default("pending"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPrestadorSchema = createInsertSchema(prestadores).omit({
  id: true,
  createdAt: true,
  webhook_status: true,
  webhook_test_status: true,
  serial_number: true, // Gerado automaticamente no backend
  ip: true, // Capturado automaticamente no backend
  accepted_terms: true, // Sempre será 1 no momento do cadastro
}).extend({
  input_mask_3: z.string().min(10, "WhatsApp deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  numeric_field: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  input_text: z.string().min(2, "Nome para divulgar deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

export type InsertPrestador = z.infer<typeof insertPrestadorSchema>;
export type Prestador = typeof prestadores.$inferSelect;

// Tabela de Usuários Administrativos
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"), // admin, super_admin, etc
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  role: true,
}).extend({
  username: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tabela de Cidades (gerenciável pelo admin)
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(), // Sigla do estado (RJ, MG, SP, etc)
  isActive: integer("is_active").notNull().default(1), // 0 = desativada, 1 = ativa
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  createdAt: true,
  isActive: true,
}).extend({
  name: z.string().min(2, "Nome da cidade deve ter pelo menos 2 caracteres"),
  state: z.string().length(2, "Estado deve ter 2 caracteres (ex: RJ, MG)").toUpperCase(),
});

export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

// Tabela de Profissões (gerenciável pelo admin)
export const professions = pgTable("professions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category"), // Categoria da profissão (ex: Construção, Saúde, Educação)
  isActive: integer("is_active").notNull().default(1), // 0 = desativada, 1 = ativa
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProfessionSchema = createInsertSchema(professions).omit({
  id: true,
  createdAt: true,
  isActive: true,
}).extend({
  name: z.string().min(2, "Nome da profissão deve ter pelo menos 2 caracteres"),
  category: z.string().optional(),
});

export type InsertProfession = z.infer<typeof insertProfessionSchema>;
export type Profession = typeof professions.$inferSelect;

// Tabela de Termos de Uso (editável pelo admin)
export const termsOfUse = pgTable("terms_of_use", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: integer("updated_by"), // ID do usuário que fez a última atualização
});

export const insertTermsOfUseSchema = createInsertSchema(termsOfUse).omit({
  id: true,
  updatedAt: true,
  updatedBy: true,
}).extend({
  content: z.string().min(100, "O conteúdo dos termos deve ter pelo menos 100 caracteres"),
});

export type InsertTermsOfUse = z.infer<typeof insertTermsOfUseSchema>;
export type TermsOfUse = typeof termsOfUse.$inferSelect;
