import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Briefcase, LogOut, Users, FileText } from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              Bem-vindo, <span className="font-medium text-foreground">{user?.username}</span>
            </p>
          </div>
          <Button
            data-testid="button-logout"
            onClick={handleLogout}
            variant="outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Admin Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <Card 
            className="hover-elevate active-elevate-2 cursor-pointer transition-all"
            onClick={() => setLocation("/admin/cities")}
            data-testid="card-cities"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Gerenciar Cidades</CardTitle>
                  <CardDescription>Adicionar, editar e remover cidades</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Controle as cidades disponíveis para cadastro de profissionais
              </p>
            </CardContent>
          </Card>

          <Card 
            className="hover-elevate active-elevate-2 cursor-pointer transition-all"
            onClick={() => setLocation("/admin/professions")}
            data-testid="card-professions"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle>Gerenciar Profissões</CardTitle>
                  <CardDescription>Adicionar, editar e remover profissões</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Controle as profissões disponíveis para cadastro
              </p>
            </CardContent>
          </Card>

          <Card 
            className="hover-elevate active-elevate-2 cursor-pointer transition-all"
            onClick={() => setLocation("/admin/termos-de-uso")}
            data-testid="card-terms"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-chart-4" />
                </div>
                <div>
                  <CardTitle>Termos de Uso</CardTitle>
                  <CardDescription>Editar o conteúdo dos Termos de Uso</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerencie o conteúdo exibido na página de Termos de Uso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle>Estatísticas do Sistema</CardTitle>
                  <CardDescription>Visão geral dos cadastros e atividades</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Acesse as estatísticas detalhadas em: <code className="bg-muted px-2 py-1 rounded">/api/stats</code>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
