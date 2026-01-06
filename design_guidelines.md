# Design Guidelines: busca.social.br Landing Page

## Design Approach: Reference-Based (Nubank + GetNinjas)

**Primary References**: Nubank (clean, trustworthy fintech aesthetic) + GetNinjas (service marketplace simplicity)

**Core Principles**:
- Clean, conversational interfaces that demystify complex services
- Trust-building through clarity and simplicity
- Mobile-first with generous touch targets
- Progressive disclosure of information
- Friendly, approachable tone reflected in design

---

## Color System

**Primary Palette**:
- Primary Blue: 207 77% 51% (Trust, professionalism)
- WhatsApp Green: 123 41% 45% (Familiar, accessible)
- Accent Orange: 14 100% 64% (Energy, action)
- Success Green: 123 46% 49% (Completion, success states)

**Neutrals**:
- Background: 0 0% 98% (Light gray)
- Text Primary: 0 0% 13% (Dark gray)
- Text Secondary: 0 0% 40% (Medium gray for supporting text)
- Border/Divider: 0 0% 90%

**Application**:
- Primary blue for main CTAs and trust elements
- WhatsApp green exclusively for WhatsApp-related actions/mentions
- Orange accent sparingly for emphasis and micro-interactions
- Maintain high contrast ratios (WCAG AA minimum)

---

## Typography

**Font Stack**:
- Headlines: Poppins (600/700 weight) - warm, friendly, modern
- Body: Roboto (400/500 weight) - highly readable, professional
- Implement via Google Fonts CDN

**Scale** (Mobile → Desktop):
- H1: 32px/48px (Hero headline)
- H2: 24px/36px (Section headers)
- H3: 20px/24px (Subsection headers)
- Body: 16px/18px (Readable on all devices)
- Small: 14px (Supporting text, captions)

**Line Heights**: 1.5 for body, 1.2 for headlines

---

## Layout System

**Spacing Primitives**: Use Tailwind units 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 (mobile) → p-12 (desktop)
- Section spacing: py-16 (mobile) → py-24 (desktop)
- Element gaps: gap-6 to gap-12

**Container Strategy**:
- Max-width: 1280px (7xl)
- Content sections: max-w-6xl
- Text blocks: max-w-3xl for optimal readability

**Grid Usage**:
- Benefits section: Single column mobile → 3 columns desktop (grid-cols-1 md:grid-cols-3)
- Process demonstration: Stacked mobile → 4-step horizontal desktop
- Keep mobile single-column throughout

---

## Images

**Hero Section**:
- Large hero image showing a professional using mobile phone with WhatsApp interface visible (right side on desktop, top on mobile)
- Image style: Bright, optimistic, Brazilian context
- Treatment: Slight gradient overlay (bottom to top, primary blue 0% to 20% opacity) for text legibility

**Supporting Images**:
- Social media icons: Use Font Awesome brands (fa-brands) for Facebook, Instagram, LinkedIn, Blogger
- WhatsApp icon: Prominent use of official WhatsApp green
- Process illustration: Simple line icons or illustrations showing: registration → publication → search results → WhatsApp contact

---

## Component Library

**Primary CTA Button**:
- Style: Solid fill, primary blue background, white text, rounded-lg
- Size: Large (px-8 py-4), prominent
- States: Hover lift effect (transform), active scale
- Mobile: Full-width below 640px

**WhatsApp CTA**:
- Style: WhatsApp green background with phone icon
- Text: "Buscar Profissional no WhatsApp" or "Cadastrar Grátis via WhatsApp"
- Include phone icon from Heroicons

**Cards** (Benefits section):
- White background, subtle shadow (shadow-md)
- Rounded corners (rounded-xl)
- Icon at top, title, description below
- Hover: Slight lift (shadow-lg transition)
- Padding: p-8

**Process Steps**:
- Numbered indicators (1→2→3→4) in circular badges
- Connecting lines/arrows between steps (hide on mobile)
- Icon + title + brief description per step
- Color progression: Blue → Green → Orange → Success

---

## Section Breakdown

**Hero** (80vh mobile, 90vh desktop):
- Split layout: Text left, image right (desktop) / stacked (mobile)
- Headline emphasizing WhatsApp simplicity
- Subheadline with practical example: "Tive um curto em casa, pode me ajudar?"
- Dual CTAs: Primary (Cadastrar Profissional) + Secondary outline (Como Funciona - scroll to explanation)

**Social Proof** (py-12):
- "Profissionais já cadastrados" counter or trust indicators
- Social media platform icons in a row
- "Apareça no Google em até 10 dias" badge

**Benefits/Features** (py-20):
- 3-column grid (desktop): Cadastro Gratuito | Presença Digital Completa | Busca via WhatsApp
- Icons above each benefit
- Short, scannable descriptions

**Process Demonstration** (py-24, light background):
- Visual timeline: Cadastro → Publicação → Google + WhatsApp → Conectar Clientes
- Each step as a card with icon, number, title, description
- Desktop: Horizontal flow with connecting elements
- Mobile: Vertical stack

**Final CTA** (py-20):
- Centered, focused section
- Headline: "Comece Agora - É Gratuito"
- Large WhatsApp button with phone number visible
- Supporting text about no credit card required

**Footer** (py-12):
- Maneco Gomes Empreendimentos branding
- Quick links: Sobre | Como Funciona | Cadastrar | Blog
- Social media links
- Contact information and WhatsApp quick access
- "Serviço 100% Gratuito" badge

---

## Responsive Behavior

**Mobile-First Priorities**:
- Hero CTA buttons: Stack vertically, full-width
- Navigation: Hamburger menu if multi-page, sticky header
- Benefit cards: Full-width, stacked with ample spacing
- Process steps: Vertical timeline with connecting line on left
- Touch targets: Minimum 44px height
- Generous padding: Never less than p-4 on mobile

**Desktop Enhancements**:
- Side-by-side layouts for hero and feature sections
- Horizontal process flow with visual connectors
- Hover states and subtle animations
- Max 1280px container prevents excessive width

---

## Micro-interactions

**Minimal Animation Budget**:
- CTA buttons: Subtle scale on hover (scale-105), shadow increase
- Cards: Lift effect on hover (translateY -2px, shadow transition)
- Social icons: Color transition on hover
- Page load: Fade-in for hero content (300ms delay)

**No Excessive Animations**: Avoid scroll-triggered animations, parallax, or complex transitions

---

## Trust & Conversion Elements

- "100% Gratuito" badges throughout
- WhatsApp number always visible (sticky on mobile)
- Clear value proposition in every section
- Testimonial quote or success metric if available
- Google ranking promise ("Primeiras páginas em até 10 dias")
- Professional photography reflecting Brazilian service providers

**Accessibility**: WCAG AA compliance, semantic HTML structure, clear focus indicators, sufficient color contrast for all text