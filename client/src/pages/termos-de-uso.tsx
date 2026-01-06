import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface TermsOfUse {
  id: number;
  content: string;
  updatedAt: string;
  updatedBy: number | null;
}

export default function TermosDeUso() {
  const { data: terms, isLoading } = useQuery<TermsOfUse>({
    queryKey: ["/api/terms-of-use"],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-2/5">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4"
            data-testid="button-back-home"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para a página inicial
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground" data-testid="heading-terms">
                Termos de Uso
              </h1>
              <p className="text-muted-foreground">
                busca.social.br e manecogomes.com.br
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Skeleton className="h-4 w-48" />
            </div>
          ) : terms && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Última atualização: {formatDate(terms.updatedAt)}</span>
              </div>
            </div>
          )}
        </div>

        <Card className="p-8 md:p-12" data-testid="card-terms-content">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-6 w-2/3 mt-8" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : terms ? (
            <div className="space-y-6" data-testid="text-terms-content">
              {terms.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={index} className="text-3xl font-heading font-bold text-foreground mb-6">
                      {line.substring(2)}
                    </h1>
                  );
                } else if (line.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
                      {line.substring(3)}
                    </h2>
                  );
                } else if (line.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-heading font-bold text-foreground mt-6 mb-3">
                      {line.substring(4)}
                    </h3>
                  );
                } else if (line.startsWith('- ')) {
                  return (
                    <li key={index} className="ml-6 text-foreground leading-relaxed">
                      {line.substring(2)}
                    </li>
                  );
                } else if (line.trim() === '') {
                  return <div key={index} className="h-2" />;
                } else {
                  return (
                    <p key={index} className="text-foreground leading-relaxed">
                      {line}
                    </p>
                  );
                }
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Termos de Uso não encontrados.</p>
            </div>
          )}
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Ao utilizar nossos serviços, você concorda com estes termos.
          </p>
          <Button asChild data-testid="button-go-home">
            <Link href="/">
              Voltar para a página inicial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
