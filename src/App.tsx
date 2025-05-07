
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as ToastPrimitive } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Leads from "@/pages/Leads";
import LeadDetail from "@/pages/LeadDetail";
import Contacts from "@/pages/Contacts";
import ContactDetail from "@/pages/ContactDetail";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Tasks from "@/pages/Tasks";
import TaskDetail from "@/pages/TaskDetail";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Partners from "@/pages/Partners";
import PartnerDetail from "@/pages/PartnerDetail";
import Calendar from "@/pages/Calendar";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";
import Suppliers from "@/pages/Suppliers";
import SupplierDetail from "@/pages/SupplierDetail";

// Создаем клиент вне компонента App
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastPrimitive />
        <SonnerToaster position="top-right" />
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* Routes with MainLayout wrapper */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/leads/:id" element={<LeadDetail />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/contacts/:id" element={<ContactDetail />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/partners/:id" element={<PartnerDetail />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/suppliers/:id" element={<SupplierDetail />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<div className="p-4"><h1 className="text-3xl font-bold">Настройки</h1><p>Страница в разработке</p></div>} />
              </Route>
            </Route>
            
            {/* Default redirect to dashboard or login based on auth status */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
