
import { useAuthStore } from "../../features/auth/store/useAuthStore";

function ProfilePic() {
    const user = useAuthStore((state)=>state.user);
    
   const alias=user?.name?.[0].toUpperCase();

  return (
    <div className="flex items-center justify-around pb-2">
        <div className=" flex text-4xl items-center w-18 h-18 rounded-full bg-primary text-shadow-primary justify-center font-bold">
           {alias}       
        </div>
    </div>
  )
}
export default ProfilePic

