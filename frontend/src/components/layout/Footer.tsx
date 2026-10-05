const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border mt-40 pt-12 pb-8 transition-colors">
      <div className="container mx-auto px-6">
        {/* Main Grid: 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Logo & Description */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="text-xl font-black tracking-tighter mb-4 font-sans uppercase">
              <span className="text-primary">SportFit</span>Hub
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Connecting athletes with top coaches, live video sessions, and interactive training.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-bold uppercase tracking-widest text-[11px] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-muted-foreground text-sm">
              <li>
                <a href="#home" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/sports" className="hover:text-primary transition-colors">
                  Sports
                </a>
              </li>
              <li>
                <a href="/fitness" className="hover:text-primary transition-colors">
                  Fitness
                </a>
              </li>
            </ul>
          </div>

          {/* For Trainers / Community */}
          <div>
            <h4 className="text-foreground font-bold uppercase tracking-widest text-[11px] mb-4">
              Coaches & Trainers
            </h4>
            <ul className="space-y-2.5 text-muted-foreground text-sm">
              <li>
                <a href="/register" className="hover:text-primary transition-colors">
                  Become a Trainer
                </a>
              </li>
              <li>
                <a href="/trainer-dashboard" className="hover:text-primary transition-colors">
                  Trainers
                </a>
              </li>
              
            </ul>
          </div>

          {/* User & Platform Support */}
          <div>
            <h4 className="text-foreground font-bold uppercase tracking-widest text-[11px] mb-4">
              Account & Help
            </h4>
            <ul className="space-y-2.5 text-muted-foreground text-sm">
              <li>
                <a href="/wallet" className="hover:text-primary transition-colors">
                  Wallet & Credits
                </a>
              </li>
              <li>
                <a href="/my-bookings" className="hover:text-primary transition-colors">
                  My Bookings
                </a>
              </li>
              <li>
                <a href="/support" className="hover:text-primary transition-colors">
                  Support & FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-[11px] font-medium text-center md:text-left">
            © {new Date().getFullYear()}{' '}
            <span className="text-foreground">SportFitHub</span>. All rights reserved.
          </p>

          <div className="flex gap-6 text-[11px] text-muted-foreground">
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;