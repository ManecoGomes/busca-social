import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import { 
  Search, 
  Globe, 
  MessageCircle, 
  MessageSquare,
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  FileText,
  Smartphone,
  Users,
  Zap,
  Quote,
  Star,
  Wrench,
  Droplet,
  Hammer,
  PaintBucket,
  Flower2,
  Car,
  Scissors,
  Camera,
  Code,
  Palette,
  Rocket,
  Shield
} from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiBlogger } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import { useAnalytics } from "@/hooks/use-analytics";
import { useState, useEffect } from "react";

export default function Home() {
  const whatsappNumber = "5524988418058";
  const cadastroMessage = encodeURIComponent("Quero efetuar meu cadastro como prestador de serviço.");
  const buscarProfissionalMessage = encodeURIComponent("BUSCO PRESTADOR DE SERVIÇOS em acordo com os termos de uso. Pode me ajudar?");
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const whatsappBuscarLink = `https://wa.me/${whatsappNumber}?text=${buscarProfissionalMessage}`;
  const whatsappCadastroLink = `https://wa.me/${whatsappNumber}?text=${cadastroMessage}`;
  const blogLink = "https://manecogomes.com.br";
  const cadastroLink = "https://www.manecogomes.com.br/profissionais";
  const { trackWhatsAppClick, trackEvent } = useAnalytics();

  // Profissões variadas para rotação animada
  const rotatingProfessions = [
    { name: "Eletricista", plural: "eletricistas", example: "Tive um curto em casa, pode me ajudar?" },
    { name: "Encanador", plural: "encanadores", example: "Preciso consertar um vazamento urgente" },
    { name: "Pintor", plural: "pintores", example: "Quero pintar minha casa" },
    { name: "Motorista", plural: "motoristas", example: "Preciso de motorista para evento" },
    { name: "Manicure", plural: "manicures", example: "Quero fazer as unhas em casa" },
    { name: "Cabeleireiro", plural: "cabeleireiros", example: "Preciso cortar o cabelo hoje" },
    { name: "Pedreiro", plural: "pedreiros", example: "Quero construir um muro" },
    { name: "Mecânico", plural: "mecânicos", example: "Meu carro está com problema" },
    { name: "Jardineiro", plural: "jardineiros", example: "Preciso cuidar do meu jardim" },
    { name: "Diarista", plural: "diaristas", example: "Preciso de faxina semanal" },
  ];

  const [currentProfessionIndex, setCurrentProfessionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProfessionIndex((prev) => (prev + 1) % rotatingProfessions.length);
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, [rotatingProfessions.length]);


  const benefits = [
    {
      icon: Globe,
      title: "Cadastro Gratuito",
      description: "Cadastre seu negócio sem pagar nada. Publicamos em Facebook, Instagram, LinkedIn e Blogger.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Presença Digital Completa",
      description: "Apareça nas primeiras páginas do Google em até 10 dias. Aumente sua visibilidade online.",
      color: "text-chart-3"
    },
    {
      icon: MessageCircle,
      title: "Busca via WhatsApp",
      description: "Clientes encontram você facilmente enviando mensagens naturais no WhatsApp.",
      color: "text-chart-2"
    }
  ];

  const process = [
    {
      number: 1,
      title: "Cadastro",
      description: "Entre em contato via WhatsApp e forneça os dados do seu negócio",
      icon: Smartphone
    },
    {
      number: 2,
      title: "Publicação",
      description: "Publicamos em redes sociais e no blog manecogomes.com.br",
      icon: FileText
    },
    {
      number: 3,
      title: "Google + WhatsApp",
      description: "Seu negócio aparece no Google e no nosso sistema de busca",
      icon: Search
    },
    {
      number: 4,
      title: "Conectar Clientes",
      description: "Pessoas te encontram e entram em contato diretamente",
      icon: Users
    }
  ];

  const socialPlatforms = [
    { name: "Facebook", Icon: SiFacebook, color: "text-[#1877F2]", url: "https://www.facebook.com/maneco.gomes.empreendimentos" },
    { name: "Instagram", Icon: SiInstagram, color: "text-[#E4405F]", url: "https://www.instagram.com/maneco_gomes_empreendimentos/" },
    { name: "TikTok", Icon: SiBlogger, color: "text-[#000000]", url: "https://www.tiktok.com/@maneco.gomes0" },
    { name: "Blogger", Icon: SiBlogger, color: "text-[#FF5722]", url: "https://blogger.com" }
  ];

  const popularCategories = [
    {
      name: "Eletricista",
      icon: Zap,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      example: "Tive um curto em casa"
    },
    {
      name: "Encanador",
      icon: Droplet,
      color: "text-primary",
      bgColor: "bg-primary/10",
      example: "Torneira vazando"
    },
    {
      name: "Pedreiro",
      icon: Hammer,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      example: "Preciso fazer reforma"
    },
    {
      name: "Pintor",
      icon: PaintBucket,
      color: "text-[#FF6B6B]",
      bgColor: "bg-[#FF6B6B]/10",
      example: "Pintar apartamento"
    },
    {
      name: "Jardineiro",
      icon: Flower2,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      example: "Manutenção do jardim"
    },
    {
      name: "Mecânico",
      icon: Wrench,
      color: "text-[#6C757D]",
      bgColor: "bg-[#6C757D]/10",
      example: "Carro fazendo barulho"
    },
    {
      name: "Cabeleireiro",
      icon: Scissors,
      color: "text-[#E91E63]",
      bgColor: "bg-[#E91E63]/10",
      example: "Corte de cabelo"
    },
    {
      name: "Fotógrafo",
      icon: Camera,
      color: "text-[#9C27B0]",
      bgColor: "bg-[#9C27B0]/10",
      example: "Fotos para evento"
    },
    {
      name: "Desenvolvedor",
      icon: Code,
      color: "text-[#2196F3]",
      bgColor: "bg-[#2196F3]/10",
      example: "Criar site"
    },
    {
      name: "Designer",
      icon: Palette,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      example: "Logo para empresa"
    }
  ];

  // Fetch real Google Reviews for Maneco Gomes Empreendimentos
  const { data: googleReviewsData, isLoading: testimonialsLoading } = useQuery<{
    reviews: Array<{
      name: string;
      rating: number;
      testimony: string;
      time: string;
      profilePhoto?: string;
      authorUrl?: string;
    }>;
    averageRating: number;
    totalReviews: number;
  }>({
    queryKey: ['/api/google-reviews'],
  });

  const testimonials = googleReviewsData?.reviews || [];
  const googleReviewUrl = "https://g.page/r/CfikEBeLsk_HEAI/review";

  const faqs = [
    {
      question: "O serviço é realmente gratuito?",
      answer: "Sim! O cadastro e toda publicação em nossas redes sociais são 100% gratuitos. Não cobramos nada e não pedimos cartão de crédito."
    },
    {
      question: "Em quanto tempo aparecerei no Google?",
      answer: "Deve aparecer nas primeiras páginas do Google em até 10 dias."
    },
    {
      question: "Como funciona a busca pelo WhatsApp?",
      answer: "O WhatsApp (24) 98841-8058 é uma inteligência artificial criada por Maneco Gomes Empreendimentos, que atende 24 horas por dia. Basta fazer uma pergunta ou dizer qual o problema, que o sistema apresentará os profissionais cadastrados informando nome, telefone e dados de forma rápida e fácil."
    },
    {
      question: "Quem pode se cadastrar?",
      answer: "Qualquer profissional liberal ou empresa pode se cadastrar: eletricistas, encanadores, pintores, arquitetos, designers, fotógrafos, desenvolvedores, e muitas outras categorias. Se você presta um serviço, pode se cadastrar!"
    },
    {
      question: "Como faço o cadastro?",
      answer: "É muito simples! Basta clicar em fazer o cadastro, utilizar o formulário do site fornecendo os seus dados e o sistema automaticamente enviará para nossa equipe aprovar. Assim que aprovado, imediatamente constará em nosso site e no WhatsApp. Após algumas horas em nossas redes sociais e em até 10 dias nas primeiras páginas do Google."
    },
    {
      question: "Posso cancelar meu cadastro a qualquer momento?",
      answer: "Sim, você pode solicitar a remoção do seu cadastro a qualquer momento, sem custos ou burocracias. Basta entrar em contato conosco pelo WhatsApp."
    },
    {
      question: "Em quais redes sociais serei publicado?",
      answer: "Em todas as nossas redes sociais: Facebook, LinkedIn, Blogger, etc. Estamos trabalhando para colocar em cada vez mais redes de forma automática."
    },
    {
      question: "Preciso ter conhecimentos técnicos para efetuar o cadastro?",
      answer: "Não! Cuidamos de tudo para você. Basta nos fornecer as informações do seu negócio e fazemos toda a publicação e otimização para aparecer no Google."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Logo variant="full" width={220} height={80} data-testid="logo-header" />
            </Link>
            
            <div className="flex items-center gap-3">
              <Button 
                size="default" 
                variant="outline"
                className="hidden sm:flex"
                asChild
                data-testid="button-header-search"
              >
                <a 
                  href={whatsappBuscarLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('header-search')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Buscar
                </a>
              </Button>
              
              <Button 
                size="default"
                className="bg-primary text-primary-foreground"
                asChild
                data-testid="button-header-register"
              >
                <Link href="/cadastro">
                  Cadastrar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-chart-2/5"></div>
        
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-chart-4 text-white border-0 px-4 py-1.5 text-sm font-medium" data-testid="badge-free-service">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Serviço de Utilidade Pública - 100% Gratuito
                  </Badge>
                  
                  <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground" data-testid="heading-hero">
                    Encontre Profissionais pelo <span className="text-primary">WhatsApp</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-chart-3 font-semibold leading-relaxed" data-testid="text-hero-description">
                    Profissional! Cadastre-se e conecte-se com novos clientes pelo WhatsApp
                  </p>
                </div>

                {/* Example Search - Rotação Animada */}
                <Card className="p-6 border-2 border-chart-2/20 bg-card hover-elevate transition-all duration-500" data-testid="card-example-search">
                  <div className="flex items-start gap-4">
                    <div className="bg-chart-2 p-3 rounded-lg flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Exemplo de busca:</p>
                      <p className="text-base md:text-lg font-medium text-foreground italic transition-opacity duration-300">
                        "{rotatingProfessions[currentProfessionIndex].example}"
                      </p>
                      <p className="text-sm text-muted-foreground transition-opacity duration-300">
                        → Receba contatos de{' '}
                        <a 
                          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá, desejo informações de ${rotatingProfessions[currentProfessionIndex].plural}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackWhatsAppClick('hero-profession-click')}
                          className="font-semibold text-primary hover:underline cursor-pointer"
                          data-testid="link-rotating-profession"
                        >
                          {rotatingProfessions[currentProfessionIndex].plural}
                        </a>{' '}
                        disponíveis
                      </p>
                    </div>
                  </div>
                </Card>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-chart-2 text-white border border-chart-2 font-medium group"
                    asChild
                    data-testid="button-whatsapp-search"
                  >
                    <a 
                      href={whatsappBuscarLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick('hero-search')}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Buscar Profissional
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground border border-primary font-medium"
                    asChild
                    data-testid="button-register-professional"
                  >
                    <Link href="/cadastro">
                      Cadastrar Meu Negócio ou Serviço
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column - Visual Element */}
              <div className="hidden md:block relative">
                <div className="relative bg-gradient-to-br from-primary to-chart-2 rounded-2xl p-8 shadow-xl">
                  <div className="bg-white rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <Zap className="w-8 h-8 text-chart-3" />
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Busca Social</h3>
                        <p className="text-sm text-muted-foreground">Encontre profissionais</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {rotatingProfessions.slice(currentProfessionIndex, currentProfessionIndex + 4).concat(
                        rotatingProfessions.slice(0, Math.max(0, (currentProfessionIndex + 4) - rotatingProfessions.length))
                      ).map((prof, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover-elevate transition-all duration-500">
                          <CheckCircle2 className="w-5 h-5 text-chart-4 flex-shrink-0" />
                          <span className="text-sm font-medium">{prof.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-24" id="beneficios">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground" data-testid="heading-benefits">
                Por Que Cadastrar Seu Negócio?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Aumente sua visibilidade online e conecte-se com clientes de forma simples e gratuita
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => (
                <Card 
                  key={idx} 
                  className="p-8 hover-elevate border-card-border"
                  data-testid={`card-benefit-${idx}`}
                >
                  <div className="space-y-4">
                    <div className={`${benefit.color} bg-muted p-4 rounded-xl w-fit`}>
                      <benefit.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-2">Publicamos em</p>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  {socialPlatforms.map(({ name, Icon, color, url }) => (
                    <a 
                      key={name} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 hover-elevate p-2 rounded-lg"
                      data-testid={`link-social-${name.toLowerCase()}`}
                      aria-label={name}
                    >
                      <Icon className={`w-8 h-8 ${color}`} />
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="h-12 w-px bg-border hidden md:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="bg-chart-4 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-lg text-foreground" data-testid="text-google-promise">
                    Apareça no Google
                  </p>
                  <p className="text-sm text-muted-foreground">em até 10 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-24 bg-muted/20" id="faq">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground" data-testid="heading-faq">
                Perguntas Frequentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Tire suas dúvidas sobre o serviço
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, idx) => (
                <AccordionItem 
                  key={idx} 
                  value={`item-${idx}`} 
                  className="bg-card border border-card-border rounded-lg px-6"
                  data-testid={`accordion-item-${idx}`}
                >
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center p-8 bg-gradient-to-br from-primary/5 to-chart-2/10 rounded-xl border border-card-border">
              <p className="text-foreground font-medium mb-4">
                Ainda tem dúvidas?
              </p>
              <Button 
                variant="default" 
                size="lg"
                className="bg-chart-2 text-white border border-chart-2"
                asChild
                data-testid="button-faq-whatsapp"
              >
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('faq-cta')}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Fale Conosco no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-chart-2/10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 border-2 border-primary/20">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary p-3 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
                    Transparência Total
                  </h2>
                </div>
                
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-base md:text-lg">
                    <strong className="text-foreground">O que NÃO fazemos:</strong> Nós não criamos redes sociais para você.
                  </p>
                  
                  <p className="text-base md:text-lg">
                    <strong className="text-foreground">O quê FAZEMOS:</strong> Publicamos suas informações (nome, telefone, serviços e dados que você fornecer) nas redes sociais da Maneco Gomes Empreendimentos. E com isso, seu nome e dados que quiser compartilhar aparererão nas redes sociais.
                  </p>
                  
                  <p className="text-base md:text-lg">
                    <strong className="text-foreground">Resultado:</strong> Seus dados ficam disponíveis nas nossas redes sociais e blog, permitindo que clientes encontrem você facilmente através do WhatsApp ou Google. Tudo de forma rápida, simples e completamente gratuita.
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <Badge className="bg-chart-4 text-white border-0 px-4 py-2">
                    <Globe className="w-4 h-4 mr-2" />
                    Publicação nas Nossas Redes
                  </Badge>
                  <Badge className="bg-chart-2 text-white border-0 px-4 py-2">
                    <Users className="w-4 h-4 mr-2" />
                    Seus Dados Visíveis
                  </Badge>
                  <Badge className="bg-chart-1 text-white border-0 px-4 py-2">
                    <Zap className="w-4 h-4 mr-2" />
                    100% Transparente
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 md:py-24" id="categorias">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground" data-testid="heading-categories">
                Categorias Mais Buscadas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Faça parte de uma das categorias mais procuradas pelos clientes
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {popularCategories.map((category, idx) => (
                <Card 
                  key={idx} 
                  className="p-6 text-center space-y-4 hover-elevate border-card-border group"
                  data-testid={`card-category-${idx}`}
                >
                  <div className={`${category.bgColor} ${category.color} p-4 rounded-xl w-fit mx-auto transition-transform group-hover:scale-110`}>
                    <category.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá, desejo informações de ${category.name.toLowerCase()}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick(`category-${category.name.toLowerCase()}`)}
                      className="font-heading font-semibold text-primary hover:underline cursor-pointer block"
                      data-testid={`link-category-${idx}`}
                    >
                      {category.name}
                    </a>
                    <p className="text-xs text-muted-foreground italic">
                      "{category.example}"
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 md:py-24 bg-muted/20" id="como-funciona">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground" data-testid="heading-process">
                Como Funciona
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Um processo simples em 4 passos para começar a receber clientes
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 md:gap-4 relative">
              {/* Connection line for desktop */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-chart-3 to-chart-4 opacity-20" style={{ top: '4rem' }}></div>

              {process.map((step, idx) => (
                <div key={idx} className="relative" data-testid={`step-${idx}`}>
                  <Card className="p-6 text-center space-y-4 h-full hover-elevate border-card-border">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className={`
                          w-16 h-16 rounded-full flex items-center justify-center font-heading font-bold text-xl
                          ${idx === 0 ? 'bg-primary text-primary-foreground' : ''}
                          ${idx === 1 ? 'bg-chart-2 text-white' : ''}
                          ${idx === 2 ? 'bg-chart-3 text-white' : ''}
                          ${idx === 3 ? 'bg-chart-4 text-white' : ''}
                        `}>
                          {step.number}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-center mb-2">
                        <step.icon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cadastro CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden" id="cadastro">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        
        <div className="container mx-auto px-6 md:px-12 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 space-y-6">
              <Badge className="bg-chart-4 text-white border-0 text-lg px-6 py-2" data-testid="badge-cadastro-free">
                100% Gratuito • Sem Custos Ocultos
              </Badge>
              
              <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground" data-testid="heading-cadastro">
                Cadastre Seu Negócio Agora
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Apareça no Google em até 10 dias e seja encontrado por milhares de clientes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center p-6 border-card-border hover-elevate">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">Cadastro Rápido</h3>
                <p className="text-muted-foreground">Processo simples em apenas alguns minutos</p>
              </Card>

              <Card className="text-center p-6 border-card-border hover-elevate">
                <div className="w-16 h-16 mx-auto mb-4 bg-chart-2/10 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-chart-2" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">Visibilidade Online</h3>
                <p className="text-muted-foreground">Apareça nas redes sociais e no Google</p>
              </Card>

              <Card className="text-center p-6 border-card-border hover-elevate">
                <div className="w-16 h-16 mx-auto mb-4 bg-chart-3/10 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-chart-3" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">Mais Clientes</h3>
                <p className="text-muted-foreground">Seja encontrado por quem precisa do seu serviço</p>
              </Card>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground border border-primary font-semibold text-lg px-12 py-6 h-auto hover-elevate active-elevate-2"
                asChild
                data-testid="button-cadastro-oficial"
              >
                <a 
                  href={cadastroLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ action: 'registration_cta', category: 'click', label: 'cadastro-oficial' })}
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Cadastrar Agora Gratuitamente
                  <ArrowRight className="w-6 h-6 ml-3" />
                </a>
              </Button>

              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-chart-4" />
                Serviço 100% seguro e gratuito da Maneco Gomes Empreendimentos
              </p>

              <div className="mt-8 pt-8 border-t border-border w-full max-w-md mx-auto">
                <p className="text-center text-muted-foreground mb-4">
                  Prefere falar conosco?
                </p>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full border-chart-2 text-chart-2 hover:bg-chart-2/10"
                  asChild
                  data-testid="button-cadastro-whatsapp"
                >
                  <a 
                    href={whatsappCadastroLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('cadastro-section')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chamar no WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-primary/5 to-chart-2/10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground" data-testid="heading-cta">
                Comece Agora - É Gratuito
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Entre em contato via WhatsApp e cadastre seu negócio em minutos
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-chart-2 text-white border border-chart-2 font-medium group min-w-[280px]"
                asChild
                data-testid="button-whatsapp-cta"
              >
                <a 
                  href={whatsappCadastroLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('final-cta')}
                >
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Cadastrar via WhatsApp
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-4" />
                Sem necessidade de cartão de crédito
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Avaliar no Google */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5" id="avaliar">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-chart-3 text-white border-0 mb-4" data-testid="badge-google-reviews">
                ⭐ {googleReviewsData?.averageRating || 5}.0 • {googleReviewsData?.totalReviews || 86} Avaliações no Google
              </Badge>
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground" data-testid="heading-review-google">
                Conhece Nosso Trabalho?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Sua avaliação no Google ajuda outros profissionais a conhecerem nosso serviço de utilidade pública
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium group px-8"
                asChild
                data-testid="button-review-google"
              >
                <a 
                  href={googleReviewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ action: 'google_review_click', category: 'engagement', label: 'cta-section' })}
                >
                  <Star className="w-5 h-5 mr-2 fill-current" />
                  Avaliar no Google
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-chart-4" />
                Avaliação pública e verificada pelo Google
              </p>
            </div>

            <div className="pt-8">
              <p className="text-sm text-muted-foreground italic">
                "Suas palavras inspiram confiança e ajudam a fortalecer nossa comunidade de profissionais"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Google Reviews */}
      <section className="py-20 md:py-24 bg-muted/20" id="depoimentos">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground" data-testid="heading-testimonials">
                O Que Dizem Nossos Profissionais
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Avaliações reais verificadas pelo Google Maps
              </p>
            </div>

            {testimonialsLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando avaliações...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12">
                <Card className="p-12 max-w-2xl mx-auto">
                  <MessageSquare className="w-16 h-16 text-muted-foreground/50 mx-auto mb-6" />
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                    Avalie Nosso Serviço no Google!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Compartilhe sua experiência com outros profissionais
                  </p>
                </Card>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial: any, idx: number) => (
                  <Card 
                    key={idx} 
                    className="p-8 hover-elevate border-card-border relative"
                    data-testid={`card-testimonial-${idx}`}
                  >
                    <div className="absolute top-6 right-6">
                      <Quote className="w-8 h-8 text-primary/20" />
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14 border-2 border-primary/20">
                          {testimonial.profilePhoto ? (
                            <img 
                              src={testimonial.profilePhoto} 
                              alt={testimonial.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                              {testimonial.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="font-heading font-semibold text-foreground">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-chart-3 text-chart-3" />
                        ))}
                      </div>

                      <p className="text-muted-foreground leading-relaxed italic">
                        "{testimonial.testimony}"
                      </p>

                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-chart-4" />
                          Avaliação verificada pelo Google
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              {/* Company Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2">Busca Social</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Maneco Gomes Empreendimentos
                  </p>
                  <div className="space-y-2">
                    <Badge className="bg-chart-4 text-white border-0" data-testid="badge-footer-free">
                      Serviço de Utilidade Pública
                    </Badge>
                    <Badge className="bg-chart-2 text-white border-0 ml-2" data-testid="badge-footer-public">
                      100% Gratuito
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="font-heading font-semibold text-foreground">Links Rápidos</h4>
                <nav className="flex flex-col gap-2">
                  <a href="#beneficios" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-benefits">
                    Benefícios
                  </a>
                  <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">
                    Como Funciona
                  </a>
                  <a href={whatsappCadastroLink} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-register">
                    Cadastrar
                  </a>
                  <a href={blogLink} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-blog">
                    Blog
                  </a>
                  <Link href="/termos-de-uso" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms-footer">
                    Termos de Uso
                  </Link>
                </nav>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h4 className="font-heading font-semibold text-foreground">Contato</h4>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    asChild
                    data-testid="button-whatsapp-footer"
                  >
                    <a 
                      href={whatsappLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick('footer')}
                    >
                      <MessageCircle className="w-4 h-4 text-chart-2" />
                      WhatsApp
                    </a>
                  </Button>
                  <div className="flex gap-3 pt-2">
                    {socialPlatforms.map(({ name, Icon, color, url }) => (
                      <a 
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-muted rounded-lg hover-elevate"
                        data-testid={`link-footer-social-${name.toLowerCase()}`}
                        aria-label={name}
                      >
                        <Icon className={`w-5 h-5 ${color}`} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border text-center space-y-3">
              <p className="text-sm font-medium text-foreground">
                <span className="text-primary">Busca Social</span> - Maneco Gomes Empreendimentos
              </p>
              <p className="text-sm text-muted-foreground">
                Serviço de Utilidade Pública e 100% Gratuito
              </p>
              <p className="text-xs text-muted-foreground">
                © 2025 Maneco Gomes Empreendimentos. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
