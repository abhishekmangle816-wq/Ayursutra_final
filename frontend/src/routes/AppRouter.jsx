import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// To be created
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import PatientDashboard from '../pages/patient/Dashboard';
import BookAppointment from '../pages/patient/BookAppointment';
import DoctorDashboard from '../pages/doctor/Dashboard';
import PatientManagement from '../pages/doctor/PatientManagement';
import AdminDashboard from '../pages/admin/Dashboard';
import PharmacyStore from '../pages/shared/PharmacyStore';
import PharmacyDashboard from '../pages/pharmacy/Dashboard';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/book" element={<BookAppointment />} />
      </Route>

      {/* Doctor Routes */}
      <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/patients" element={<PatientManagement />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Pharmacy Routes */}
      <Route element={<ProtectedRoute allowedRoles={['pharmacy']} />}>
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
      </Route>

      {/* Shared Store Route */}
      <Route element={<ProtectedRoute allowedRoles={['doctor', 'pharmacy']} />}>
        <Route path="/pharmacy-store" element={<PharmacyStore />} />
      </Route>

      <Route path="/unauthorized" element={<div className="p-10 text-center"><h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1></div>} />
      <Route path="*" element={<div className="p-10 text-center"><h1 className="text-2xl font-bold">404 - Not Found</h1></div>} />
    </Routes>
  );
};

export default AppRouter;
