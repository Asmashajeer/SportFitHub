import { Navigate } from "react-router-dom";
import { LoadingScreen } from "../components/.ui.compo/LoadingScreen";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import { ROLES, type UserRole } from "../constants/constants";
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

  const userRole = user?.role?.toLowerCase();
  if (
    user && user.role!==ROLES.ADMIN &&
    !user.hasProfile && user.isVerified &&
    location.pathname !== `/${userRole}/add-Profile`
  ) {
    return <Navigate to={`/${user.role}/add-Profile`} replace />;
  }

  //  Role-based check
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    <Navigate to='/unathorized'/> 
  }

  return children;
};
export default ProtectedRoute;
