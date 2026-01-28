import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Master from './pages/Master'
import CustomerReg from './pages/CustomerReg'
import Reports from './pages/Reports'
import Employees from './pages/Employees'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <AuthProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            <Route path="/master" element={
              <ProtectedRoute requiredRole="Admin">
                <Master />
              </ProtectedRoute>
            } />
            
            <Route path="/customer-registration" element={
              <ProtectedRoute>
                <CustomerReg />
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            
            {/* Admin Only Route */}
            <Route path="/employees" element={
              <ProtectedRoute requiredRole="Admin">
                <Employees />
              </ProtectedRoute>
            } />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;