import { Navigate } from "react-router-dom";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import type { UserRole } from "../constants/constants";
import { useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[]; // set the user-roles
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  const location = useLocation();

  if (isLoading)
    return (
      <div>
        <LoadingScreen />
      </div>
    );

  if (!isAuthenticated ) return <Navigate to="/login" />;
  // if(isAuthenticated && !user)
  //       return (
  //     <div>
  //       <LoadingScreen />
  //     </div>
  //   );
  
  //  If logged in but NO profile, force them to Add Profile
  const userRole = user?.role?.toLowerCase();
  if (
    user &&
    !user.hasProfile && 
    location.pathname !== `/${userRole}/add-Profile`
  ) {
    return <Navigate to={`/${user.role}/add-Profile`} replace />;
  }

  //  Role-based check
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
export default ProtectedRoute;
