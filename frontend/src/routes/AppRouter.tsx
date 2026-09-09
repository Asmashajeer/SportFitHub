import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../constants/constants';

//  public pages
const HomePage = lazy(() => import('../pages/HomePage'));
const SportsPage = lazy(() => import('@/pages/SportsPage'));
const SessionDetailPage = lazy(() => import('@/pages/SessionDetailPage'));
const FitnessPage = lazy(() => import('@/pages/FitnessPage'));
const FitnessSessionDetailPage = lazy(() => import('@/pages/FitnessSessionDetailPage'));
const SessionsListingPage = lazy(() => import('@/pages/SessionsListingPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));

// auth components
const Login = lazy(() => import('../features/auth/component/Login'));
const Register = lazy(() => import('@/features/auth/component/Register'));
const VerifyEmail = lazy(() => import('../features/auth/component/VerifyEmail'));
const ForgotPassword = lazy(() => import('../features/auth/component/ForgotPassword'));
const ResetPassword = lazy(() => import('../features/auth/component/ResetPassword'));
const UserRoleSelector = lazy(() => import('../features/auth/component/UserRoleSelector'));

//  routes
const UserRoutes = lazy(() => import('./UserRoutes'));
const TrainerRoutes = lazy(() => import('./TrainerRoutes'));
const AdminRoutes = lazy(() => import('./AdminRoutes'));
const BookingRoutes = lazy(() => import('./BookingRoutes'));
const LiveSessionRoutes = lazy(() => import('./LiveSessionRoutes'));
const TrainerProfileForm = lazy(() => import('../features/trainer/page/TrainerOnboarding'));;

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);
function AppRouter() {
  return (
    <div className="min-w-[320px]">
      <Router>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/sessions" element={<SessionsListingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/logout" element={<HomePage />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-role" element={<UserRoleSelector />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route element={<MainLayout />}>           

              <Route path="/trainer/add-Profile"  element={
                <ProtectedRoute allowedRoles={[ROLES.USER,ROLES.TRAINER]}> <TrainerProfileForm /> </ProtectedRoute>}
              />

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

            {/* BookingRoute */}
            <Route
              path="/checkout/*"
              element={
                <ProtectedRoute allowedRoles={[ROLES.USER]}>
                  <BookingRoutes />
                </ProtectedRoute>
              }
            />


            <Route
              path="/live-session/*"
              element={
                <ProtectedRoute allowedRoles={[ROLES.USER,ROLES.TRAINER]}>
                  <LiveSessionRoutes />
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
            {/* <Route path="/*" element={<NotFound />} /> */}
          </Routes>
        </Suspense>  
      </Router>
    </div>
  );
}

export default AppRouter;
