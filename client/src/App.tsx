import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCheckAuth } from './hooks/useAuth';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import TodosPage from './pages/TodosPage';
function App() {
  const { isLoading, isAuthenticated } = useAuthStore();
  useCheckAuth();

  useEffect(() => {
    document.title = 'Todo App - TypeScript';
    // Always apply dark mode
    document.documentElement.classList.add('dark');
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TodosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />}
        />
        <Route path="/otpverification/:email/:phone" element={<OtpVerificationPage />} />
        <Route
          path="/forgotPassword"
          element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
        />
        <Route
          path="/resetPassword/:token"
          element={isAuthenticated ? <Navigate to="/" replace /> : <ResetPasswordPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer theme="colored" position="top-right" />
    </>
  );
}

export default App;

