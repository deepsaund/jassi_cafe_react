import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/Layout/DashboardLayout';
import CustomerDashboard from './pages/Customer/DashboardHome';
import ServiceCatalog from './pages/Customer/ServiceCatalog';
import ServiceApply from './pages/Customer/ServiceApply';
import StaffDashboard from './pages/Staff/StaffDashboard';
import VerificationPage from './pages/Staff/VerificationPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import ServiceManagement from './pages/Admin/ServiceManagement';
import AuditLogs from './pages/Admin/AuditLogs';
import Settlements from './pages/Admin/Settlements';
import B2BBulkUpload from './components/B2B/B2BBulkUpload';

import { ErrorBoundary } from './components/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // Replace with Skeleton later
  if (!user) return <Navigate to="/login" />;
  return children;
};

const DashboardHome = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'staff') return <StaffDashboard />;
  return <CustomerDashboard />;
};

function App() {
  return (
    <BrowserRouter basename="/WEBSITE/frontend">
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              {/* ... routes ... */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardHome />} />
                <Route path="services" element={<ServiceCatalog />} />
                <Route path="service/:id" element={<ServiceApply />} />
                <Route path="bulk" element={<B2BBulkUpload />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/users" element={<UserManagement />} />
                <Route path="admin/services" element={<ServiceManagement />} />
                <Route path="admin/logs" element={<AuditLogs />} />
                <Route path="admin/settlements" element={<Settlements />} />
                <Route path="staff" element={<StaffDashboard />} />
                <Route path="staff/verify/:id" element={<VerificationPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
