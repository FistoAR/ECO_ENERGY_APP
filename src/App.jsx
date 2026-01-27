import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Master from './pages/Master'
import CustomerReg from './pages/CustomerReg'
import Reports from './pages/Reports'
import Employees from './pages/Employees'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/master" element={<ProtectedRoute><Master /></ProtectedRoute>} />
          <Route path="/customer-registration" element={<ProtectedRoute><CustomerReg /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}