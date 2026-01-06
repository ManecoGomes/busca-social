import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { City, InsertCity } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Power } from "lucide-react";

export default function AdminCitiesPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState<InsertCity>({ name: "", state: "" });

  const { data: cities = [], isLoading } = useQuery<City[]>({
    queryKey: ["/api/admin/cities"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCity) => {
      await apiRequest("POST", "/api/admin/cities", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      toast({ title: "Cidade criada com sucesso!" });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: "Erro ao criar cidade", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCity> }) => {
      await apiRequest("PATCH", `/api/admin/cities/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      toast({ title: "Cidade atualizada com sucesso!" });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: "Erro ao atualizar cidade", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/cities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      toast({ title: "Cidade excluída com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir cidade", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/admin/cities/${id}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      toast({ title: "Status alterado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    },
  });

  const handleOpenNew = () => {
    setEditingCity(null);
    setFormData({ name: "", state: "" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (city: City) => {
    setEditingCity(city);
    setFormData({ name: city.name, state: city.state });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCity(null);
    setFormData({ name: "", state: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.state) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    if (editingCity) {
      updateMutation.mutate({ id: editingCity.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              data-testid="button-back"
              variant="ghost"
              onClick={() => setLocation("/admin")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Gerenciar Cidades</h1>
              <p className="text-muted-foreground">
                {cities.length} cidade{cities.length !== 1 ? "s" : ""} cadastrada{cities.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            data-testid="button-add-city"
            onClick={handleOpenNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Cidade
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Cidades</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Carregando...</p>
            ) : cities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma cidade cadastrada
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city) => (
                    <TableRow key={city.id} data-testid={`row-city-${city.id}`}>
                      <TableCell className="font-medium">{city.name}</TableCell>
                      <TableCell>{city.state}</TableCell>
                      <TableCell>
                        <Badge variant={city.isActive === 1 ? "default" : "secondary"}>
                          {city.isActive === 1 ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          data-testid={`button-toggle-${city.id}`}
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleMutation.mutate(city.id)}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button
                          data-testid={`button-edit-${city.id}`}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(city)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          data-testid={`button-delete-${city.id}`}
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(city.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCity ? "Editar Cidade" : "Nova Cidade"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da cidade
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Cidade</Label>
                  <Input
                    id="name"
                    data-testid="input-city-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Rio de Janeiro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado (UF)</Label>
                  <Input
                    id="state"
                    data-testid="input-city-state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    placeholder="Ex: RJ"
                    maxLength={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button
                  data-testid="button-save-city"
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
