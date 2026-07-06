import React from 'react';
import { Menu, X, User, LogOut, LogIn } from 'lucide-react';
import {  NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import Avatar from '../reusable/Avatar';
import { authService } from '@/features/auth/service/authService';
import { Button } from '../ui/Button';
import { ROLES } from '@/constants/constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, clearAuth } = useAuthStore();
  if (isLoading) return <div className="w-10 h-10" />;

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
  };
  return (
    <header className="fixed top-0 left-0 z-50 w-full shrink-0 p-0 border-border bg-background/80 backdrop-blur-md transition-all">
      <div className="section-container px-4  flex h-16 md:h-20 items-center  justify-between">
       <div   
          className="flex items-center justify-around   cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <img 
              src="/sportfithub_logo.png" 
              alt="SportFitHub" 
              className="h-10 w-auto  px-4 object-contain transition-transform group-hover:scale-105"
          />   
          
        </div>

        {user?.role !== ROLES.TRAINER && (
          <nav className="hidden md:flex items-center space-x-10 justify-evenly">
            {['Sports', 'Fitness'].map((item) => (
                 <NavLink
                key={item}
                to={`/${item.toLowerCase()}`}
                className={({ isActive }) =>
                    `text-sm font-bold uppercase tracking-widest transition-colors ${
                        isActive
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-primary'
                    }`
                }
            >
                {item}
            </NavLink>
            ))}
          </nav>
        )}

        <div className="hidden md:flex place-items-left me-20 ">
          {!isAuthenticated ? (
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="p-2 rounded-full hover:bg-muted transition-colors group"
            >
              <User className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              Login
            </Button>
          ) : (
            <Avatar />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation - Styled with your 'card' background color */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card p-4 flex flex-col space-y-4 animate-in slide-in-from-top duration-300">
          {['Sports', 'Fitness', 'Trainer'].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-lg font-bold text-foreground hover:text-primary transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                navigate(`/${item.toLowerCase()}`);
              }}
            >
              {item}
            </a>
          ))}
          
          {!isAuthenticated ? (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 flex justify-center  rounded-xl gap-2 bg-transparent items-center  text-foreground  hover:bg-primary transition-colors "
            >
              <LogIn className="w-5 h-5 " />
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-3 flex justify-center  rounded-xl gap-2 bg-transparent items-center  text-foreground  hover:bg-primary transition-colors "
            >
              <LogOut className="w-5 h-5 " />
              Logout
            </button>
          )}
         
        </nav>
      )}
    </header>
  );
};

export default Header;
