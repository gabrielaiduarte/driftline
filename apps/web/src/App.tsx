import { Navigate, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import IncidentsPage from "./pages/IncidentsPage";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";

export default function App() {
  return (
    <Routes>

      {/* Authenticated users are redirected away from signin page */}
      <Route 
        path="/signin" 
        element={
          <PublicOnlyRoute>
            <SignInPage />
          </PublicOnlyRoute>
        } 
      />

      {/**
       * Pass recovery is separate from PublicOnlyRoute bc Supabase recovery link
       * establishes special auth session
       */}
      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      {/* Application routes require auth Supabase session */}
      <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <IncidentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to="/signin" replace />}
      />
    </Routes>
  )
}