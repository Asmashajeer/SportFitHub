import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { authService } from '../service/authService';
import { ROLES } from '@/constants/constants';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setHasProfile = useAuthStore((state) => state.setHasProfile);
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      // credentialResponse.credential is the "ID Token" your backend wants
      const idToken = credentialResponse.credential;
      if (!idToken) {
        console.log(' google login failed');
        toast.error('google login failed');
        return;
      }

      const userData = await authService.googleLogin(idToken);
      setUser(userData.user);

      if (Object.values(ROLES).includes(userData.role) === false) {
        return navigate('/update-role');
      }
      if (!userData.hasProfile) {
        if (userData.role === ROLES.TRAINER) {
          return navigate('/trainer/add-Profile');
        } else if (userData.role === ROLES.USER) {
          return navigate('/user/add-Profile');
        }
      } else {
        setHasProfile(userData.hasProfile);
        navigate(`/${userData.role}/dashboard`);
      }
    } catch (error) {
      toast.error(error?.toString() || 'Something went wrong');
    }
  };
  return (
    <>
      {/* The Google Button Component */}
      <div className="flex justify-center mt-6 ">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log('Login Failed')}
          theme="filled_black"
          size="large"
          shape="pill"
          width="350"
          text="signin_with"
        />
      </div>
    </>
  );
};

export default GoogleLoginButton;
