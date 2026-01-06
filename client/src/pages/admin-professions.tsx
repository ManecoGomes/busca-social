import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Profession, InsertProfession } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Power, Search, Upload } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export default function AdminProfessionsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingProfession, setEditingProfession] = useState<Profession | null>(null);
  const [formData, setFormData] = useState<InsertProfession>({ name: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: professions = [], isLoading } = useQuery<Profession[]>({
    queryKey: ["/api/admin/professions"],
  });

  const filteredProfessions = professions.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: async (data: InsertProfession) => {
      await apiRequest("POST", "/api/admin/professions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/professions"] });
      toast({ title: "Profissão criada com sucesso!" });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: "Erro ao criar profissão", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProfession> }) => {
      await apiRequest("PATCH", `/api/admin/professions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/professions"] });
      toast({ title: "Profissão atualizada com sucesso!" });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: "Erro ao atualizar profissão", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/professions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/professions"] });
      toast({ title: "Profissão excluída com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir profissão", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/admin/professions/${id}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/professions"] });
      toast({ title: "Status alterado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    },
  });

  const importMutation = useMutation({
    mutationFn: async ({ data, fileName }: { data: any[], fileName: string }) => {
      return await apiRequest("POST", "/api/admin/professions/import", { data, fileName });
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/professions"] });
      toast({ 
        title: "Importação concluída!", 
        description: `Adicionadas: ${response.added}, Duplicadas: ${response.skipped}, Erros: ${response.errors}`
      });
      setImportDialogOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao importar profissões", 
        description: error?.message || "Tente novamente",
        variant: "destructive" 
      });
    },
  });

  const handleOpenNew = () => {
    setEditingProfession(null);
    setFormData({ name: "" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (profession: Profession) => {
    setEditingProfession(profession);
    setFormData({ name: profession.name });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProfession(null);
    setFormData({ name: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({ title: "Preencha o nome da profissão", variant: "destructive" });
      return;
    }

    if (editingProfession) {
      updateMutation.mutate({ id: editingProfession.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && Array.isArray(results.data) && results.data.length > 0) {
            importMutation.mutate({ data: results.data, fileName });
          } else {
            toast({ 
              title: "Arquivo vazio", 
              description: "O arquivo CSV não contém dados válidos",
              variant: "destructive" 
            });
          }
        },
        error: (error) => {
          toast({ 
            title: "Erro ao ler CSV", 
            description: error.message,
            variant: "destructive" 
          });
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Parse Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData && Array.isArray(jsonData) && jsonData.length > 0) {
            importMutation.mutate({ data: jsonData, fileName });
          } else {
            toast({ 
              title: "Arquivo vazio", 
              description: "O arquivo Excel não contém dados válidos",
              variant: "destructive" 
            });
          }
        } catch (error: any) {
          toast({ 
            title: "Erro ao ler Excel", 
            description: error.message,
            variant: "destructive" 
          });
        }
      };
      reader.readAsBinaryString(file);
    } else {
      toast({ 
        title: "Formato inválido", 
        description: "Apenas arquivos CSV ou Excel (.xlsx, .xls) são aceitos",
        variant: "destructive" 
      });
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
              <h1 className="text-3xl font-bold">Gerenciar Profissões</h1>
              <p className="text-muted-foreground">
                {professions.length} profiss{professions.length !== 1 ? "ões" : "ão"} cadastrada{professions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              data-testid="button-import-professions"
              variant="outline"
              onClick={() => setImportDialogOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar CSV/Excel
            </Button>
            <Button
              data-testid="button-add-profession"
              onClick={handleOpenNew}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Profissão
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Profissões</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                data-testid="input-search-profession"
                placeholder="Buscar profissão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Carregando...</p>
            ) : filteredProfessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchTerm ? "Nenhuma profissão encontrada" : "Nenhuma profissão cadastrada"}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessions.map((profession) => (
                    <TableRow key={profession.id} data-testid={`row-profession-${profession.id}`}>
                      <TableCell className="font-medium">{profession.name}</TableCell>
                      <TableCell>
                        <Badge variant={profession.isActive === 1 ? "default" : "secondary"}>
                          {profession.isActive === 1 ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          data-testid={`button-toggle-${profession.id}`}
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleMutation.mutate(profession.id)}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button
                          data-testid={`button-edit-${profession.id}`}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(profession)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          data-testid={`button-delete-${profession.id}`}
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(profession.id)}
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
                {editingProfession ? "Editar Profissão" : "Nova Profissão"}
              </DialogTitle>
              <DialogDescription>
                Preencha o nome da profissão
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Profissão</Label>
                  <Input
                    id="name"
                    data-testid="input-profession-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="Ex: Eletricista"
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
                  data-testid="button-save-profession"
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Importar Profissões</DialogTitle>
              <DialogDescription>
                Selecione um arquivo CSV ou Excel com as profissões a importar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">Arquivo CSV ou Excel</Label>
                <Input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  data-testid="input-import-file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={importMutation.isPending}
                />
                <p className="text-sm text-muted-foreground">
                  O arquivo deve conter uma coluna chamada "nome", "profissao", "name" ou "profession"
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="text-sm font-semibold">Formato esperado:</p>
                <div className="text-xs font-mono bg-background p-2 rounded">
                  <div>nome</div>
                  <div>Advogado</div>
                  <div>Eletricista</div>
                  <div>Desenvolvedor</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  • Profissões duplicadas serão ignoradas automaticamente<br />
                  • Linhas vazias ou inválidas serão puladas<br />
                  • Um resumo será exibido após a importação
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setImportDialogOpen(false);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                disabled={importMutation.isPending}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
