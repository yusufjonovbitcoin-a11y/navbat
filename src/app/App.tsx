import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuestionTemplatesProvider } from '@/app/context/QuestionTemplatesContext';
import { Login } from '@/app/components/Login';
import { SuperAdminDashboard } from '@/app/components/SuperAdminDashboard';
import { AdminDashboard } from '@/app/components/AdminDashboard';
import { DoctorDashboard } from '@/app/components/DoctorDashboard';
import { PatientForm } from '@/app/components/PatientForm';

type UserRole = 'super_admin' | 'admin' | 'doctor' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleLogin = (role: UserRole, id: string) => {
    setUserRole(role);
    setUserId(id);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserId(null);
  };

  return (
    <QuestionTemplatesProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/patient-form/:formId" element={<PatientForm />} />

        <Route
          path="/*"
          element={
            !userRole ? (
              <Login onLogin={handleLogin} />
            ) : userRole === 'super_admin' ? (
              <SuperAdminDashboard onLogout={handleLogout} />
            ) : userRole === 'admin' ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : userRole === 'doctor' ? (
              <DoctorDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        </Routes>
      </BrowserRouter>
    </QuestionTemplatesProvider>
  );
}
