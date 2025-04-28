
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as ToastPrimitive } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastPrimitive />
      <SonnerToaster position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leads" element={<div className="p-4"><h1 className="text-3xl font-bold">Лиды</h1><p>Страница в разработке</p></div>} />
              <Route path="/contacts" element={<div className="p-4"><h1 className="text-3xl font-bold">Контакты</h1><p>Страница в разработке</p></div>} />
              <Route path="/orders" element={<div className="p-4"><h1 className="text-3xl font-bold">Заказы</h1><p>Страница в разработке</p></div>} />
              <Route path="/tasks" element={<div className="p-4"><h1 className="text-3xl font-bold">Задачи</h1><p>Страница в разработке</p></div>} />
              <Route path="/calendar" element={<div className="p-4"><h1 className="text-3xl font-bold">Календарь</h1><p>Страница в разработке</p></div>} />
              <Route path="/products" element={<div className="p-4"><h1 className="text-3xl font-bold">Товары</h1><p>Страница в разработке</p></div>} />
              <Route path="/partners" element={<div className="p-4"><h1 className="text-3xl font-bold">Партнеры</h1><p>Страница в разработке</p></div>} />
              <Route path="/settings" element={<div className="p-4"><h1 className="text-3xl font-bold">Настройки</h1><p>Страница в разработке</p></div>} />
            </Route>
            
            {/* Default redirect to dashboard or login based on auth status */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
