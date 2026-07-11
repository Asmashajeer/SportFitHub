import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Login from '../features/auth/component/Login';

import { ROLES } from '../constants/constants';
// import { LoadingScreen } from '../components/ui/LoadingScreen';

import ProtectedRoute from './ProtectedRoute';
import UserRoutes from './UserRoutes';
import TrainerRoutes from './TrainerRoutes';
import ForgotPassword from '../features/auth/component/ForgotPassword';
import ResetPassword from '../features/auth/component/ResetPassword';
import UserRoleSelector from '../features/auth/component/UserRoleSelector';

import VerifyEmail from '../features/auth/component/VerifyEmail';
import MainLayout from '../components/layout/MainLayout';
import TrainerProfileForm from '../features/trainer/page/TrainerOnboarding';
import AdminRoutes from './AdminRoutes';

import Register from '@/features/auth/component/Register';
import NotFound from '@/pages/NotFound';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import SportsPage from '@/pages/SportsPage';
import SessionDetailPage from '@/pages/SessionDetailPage';
import FitnessPage from '@/pages/FitnessPage';
import FitnessSessionDetailPage from '@/pages/FitnessSessionDetailPage';

import BookingRoutes from './BookingRoutes';
function AppRouter() {
  return (
    <div className="min-w-[320px]">
      <Router>
        <Routes>
          {/* public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/fitness" element={<FitnessPage />} />
          <Route
            path="/sports/sessions/:sessionId"
            element={<SessionDetailPage />}
          />
          <Route
            path="/fitness/sessions/:sessionId"
            element={<FitnessSessionDetailPage />}
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

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
            <Route path="/trainer/add-Profile"  element={
               <ProtectedRoute allowedRoles={[ROLES.USER,ROLES.TRAINER]}> <TrainerProfileForm /> </ProtectedRoute>}
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

          {/* BookingRoute */}
          <Route
            path="/checkout/*"
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER]}>
                <BookingRoutes />
              </ProtectedRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
