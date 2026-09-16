import { Navigate, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import IncidentsPage from "./pages/IncidentsPage";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";

export default function App() {
  return (
    <Routes>

      <Route 
        path="/signin" 
        element={
          <PublicOnlyRoute>
            <SignInPage />
          </PublicOnlyRoute>
        } 
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

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