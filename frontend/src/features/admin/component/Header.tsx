
import React from 'react';
import { Menu, X, User, Bell, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import Avatar from '@/components/layout/Avatar';
import { authService } from '@/features/auth/service/authService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate=useNavigate();
  const {isAuthenticated,isLoading,clearAuth}=useAuthStore();
  if(isLoading) return <div className="w-10 h-10" />;
  
  const handleLogout=async()=>{
     await authService.logout();
     clearAuth();
  }
  return (
  
    <header className="fixed top-0  left-64 w-full px-.5 border-b border-border bg-background/80 backdrop-blur-md transition-all">
      
      <div className="section-container flex items-center justify-around h-16 md:h-20   "> 
        <div className=" md:flex  place-items-end me-20 ">
          <button className="p-2 rounded-full hover:bg-muted transition-colors group">
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          {!isAuthenticated ?(
          <button  onClick={()=>navigate('/login')} className="p-2 rounded-full hover:bg-muted transition-colors group" >
            <User className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          ):(       
            <Avatar/>
          )}         
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation - Styled with your 'card' background color */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card p-6 flex flex-col space-y-6 animate-in slide-in-from-top duration-300">
          {['Sports', 'Fitness', 'Trainer'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="text-lg font-bold text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          {/* <button className="w-full bg-primary text-primary-foreground  rounded-lg font-black glow-primary"> */}
            {!isAuthenticated ?(
              <button  onClick={()=>navigate('/login')} className="w-full py-3 flex justify-center  rounded-xl gap-2 bg-transparent items-center  text-foreground  hover:bg-primary transition-colors " >
                <LogIn className="w-5 h-5 "/>
                Login
               
              </button>
              ):(       
                <button  onClick={handleLogout} className="w-full py-3 flex justify-center  rounded-xl gap-2 bg-transparent items-center  text-foreground  hover:bg-primary transition-colors " >
                <LogOut className="w-5 h-5 "/>
                 Logout
               
              </button>
           )}  
          {/* </button> */}
        </nav>
      )}
    </header>
  );
};

export default Header;







