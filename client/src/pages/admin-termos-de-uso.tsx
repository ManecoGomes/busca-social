import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Save, Eye, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TermsOfUse {
  id: number;
  content: string;
  updatedAt: string;
  updatedBy: number | null;
}

const termsFormSchema = z.object({
  content: z.string().min(100, "O conteúdo dos termos deve ter pelo menos 100 caracteres"),
});

type TermsFormValues = z.infer<typeof termsFormSchema>;

export default function AdminTermosDeUso() {
  const { toast } = useToast();

  const { data: terms, isLoading } = useQuery<TermsOfUse>({
    queryKey: ["/api/terms-of-use"],
  });

  const form = useForm<TermsFormValues>({
    resolver: zodResolver(termsFormSchema),
    values: {
      content: terms?.content || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: TermsFormValues) => {
      return await apiRequest("PUT", "/api/admin/terms-of-use", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/terms-of-use"] });
      toast({
        title: "Sucesso!",
        description: "Termos de Uso atualizados com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar os Termos de Uso.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: TermsFormValues) => {
    updateMutation.mutate(values);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-2/5">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4"
            data-testid="button-back-admin"
          >
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o painel
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground" data-testid="heading-admin-terms">
                Editar Termos de Uso
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie o conteúdo dos Termos de Uso para ambos os domínios
              </p>
            </div>

            <Button
              variant="outline"
              asChild
              data-testid="button-view-public"
            >
              <Link href="/termos-de-uso" target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                Ver página pública
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <Skeleton className="h-4 w-64 mt-4" />
          ) : terms && (
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Última atualização: {formatDate(terms.updatedAt)}</span>
            </div>
          )}
        </div>

        <Card data-testid="card-edit-terms">
          <CardHeader>
            <CardTitle>Conteúdo dos Termos de Uso</CardTitle>
            <CardDescription>
              O conteúdo usa formato Markdown. Use # para títulos principais, ## para subtítulos, e - para listas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Texto dos Termos de Uso</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={20}
                            className="font-mono text-sm"
                            placeholder="Digite o conteúdo dos Termos de Uso..."
                            data-testid="textarea-terms-content"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      data-testid="button-save-terms"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      asChild
                    >
                      <Link href="/admin">
                        Cancelar
                      </Link>
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Dicas de Formatação Markdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-2">Títulos:</p>
                <code className="block bg-muted p-2 rounded">
                  # Título Principal<br/>
                  ## Subtítulo<br/>
                  ### Sub-subtítulo
                </code>
              </div>
              <div>
                <p className="font-semibold mb-2">Listas:</p>
                <code className="block bg-muted p-2 rounded">
                  - Item 1<br/>
                  - Item 2<br/>
                  - Item 3
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
