import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page components
import Home from './pages/Home';
import EmpresaCadastro from './pages/EmpresaCadastro';
import EmpresaDetalhes from './pages/EmpresaDetalhes';
import Busca from './pages/Busca';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Auth pages
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Context providers
import { EmpresaProvider } from './contexts/EmpresaContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <EmpresaProvider>
        <div className="App">
          <Helmet>
            <title>IDEBRASIL - Plataforma de Classificados</title>
            <meta
              name="description"
              content="Conecte-se com empreendedores e empresas da comunidade IDEBRASIL através da nossa plataforma de classificados."
            />
          </Helmet>

          <Header />

          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/busca" element={<Busca />} />
              <Route path="/empresa/cadastro" element={<EmpresaCadastro />} />
              <Route path="/empresa/:id" element={<EmpresaDetalhes />} />
              <Route path="/admin" element={
                <ProtectedRoute requiredType="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </EmpresaProvider>
    </AuthProvider>
  );
}

export default App;