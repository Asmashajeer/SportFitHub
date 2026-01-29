import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../features/auth/component/Login";

import { ROLES } from "../constants/constants";
// import { LoadingScreen } from '../components/ui/LoadingScreen';

import ProtectedRoute from "./ProtectedRoute";
import UserRoutes from "./UserRoutes";
import TrainerRoutes from "./TrainerRoutes";
import ForgotPassword from "../features/auth/component/ForgotPassword";
import ResetPassword from "../features/auth/component/ResetPassword";
import UserRoleSelector from "../features/auth/component/UserRoleSelector";
import { Home } from "lucide-react";
import VerifyEmail from "../features/auth/component/VerifyEmail";
import MainLayout from "../components/layout/MainLayout";
import AdminRoutes from "./AdminRoutes";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import Register from "@/features/auth/component/Register";
function AppRouter() {
  const isAuthenticated=useAuthStore(state=>state.isAuthenticated);
  const user =useAuthStore(state=>state.user);

  return (
    <>
      <Router>
        <Routes>
          {/* public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register/>} />
         
          <Route path="/login" element={
              isAuthenticated && user &&user.isVerified 
                ? <Navigate to={Object.values(ROLES).includes(user.role) ? `/${user.role}/dashboard` : "/update-role"} replace />
                : <Login />
            } />
         
          
          <Route path="/logout" element={<HomePage />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/update-role" element={<UserRoleSelector />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route element={<MainLayout />}>
            {/* user Routes */}
            <Route
              path="/user/*"
              element={
                <ProtectedRoute allowedRoles={[ROLES.USER]}>
                  <UserRoutes />
                </ProtectedRoute>
              }
            />

            {/* Trainer Routes */}
            <Route
              path="/trainer/*"
              element={
                <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
                  <TrainerRoutes />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default AppRouter;
