import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "@/pages/home";
import Cadastro from "@/pages/cadastro";
import LoginPage from "@/pages/login";
import AdminDashboard from "@/pages/admin";
import AdminCitiesPage from "@/pages/admin-cities";
import AdminProfessionsPage from "@/pages/admin-professions";
import AdminTermosDeUso from "@/pages/admin-termos-de-uso";
import TermosDeUso from "@/pages/termos-de-uso";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cadastro" component={Cadastro} />
      <Route path="/login" component={LoginPage} />
      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/cities">
        <ProtectedRoute>
          <AdminCitiesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/professions">
        <ProtectedRoute>
          <AdminProfessionsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/termos-de-uso">
        <ProtectedRoute>
          <AdminTermosDeUso />
        </ProtectedRoute>
      </Route>
      <Route path="/termos-de-uso" component={TermosDeUso} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
