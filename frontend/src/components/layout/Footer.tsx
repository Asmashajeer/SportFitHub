const Footer = () => {
  return (
    <footer className=" w-full bg-background border-t border-border mt-40 pt-5 transition-colors">
      <div className="container mx-auto px-6">
        {/* Main Grid: 1 col on mobile, 2 on small tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Logo & Description - Full width on mobile */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="text-2xl sm:text-sm font-black tracking-tighter mb-4 font-sans uppercase">
              <span className="text-primary">SportFit</span>Hub
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Transforming athletes through elite coaching, personalized
              training, and a high-performance community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="min-w-30">
            <h4 className="text-foreground font-bold uppercase tracking-widest text-[10px] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <a
                  href="#home"
                  className="hover:text-primary transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#sports"
                  className="hover:text-primary transition-colors"
                >
                  Sports
                </a>
              </li>
              <li>
                <a
                  href="#fitness"
                  className="hover:text-primary transition-colors"
                >
                  Fitness
                </a>
              </li>
            </ul>
          </div>

          {/* Programs - Un-commented and made responsive */}
          <div className="min-w-30">
            <h4 className="text-foreground font-bold uppercase tracking-widest text-[10px] mb-6">
              Programs
            </h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Training
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Fitness
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Coaching
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="min-w-30">
            <h4 className="text-foreground font-bold uppercase tracking-widest text-[10px] mb-6">
              Support
            </h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Stack on mobile, side-by-side on desktop */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-[11px] font-medium text-center md:text-left">
            © {new Date().getFullYear()}{' '}
            <span className="text-foreground">SportFitHub</span>. All rights
            reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(
              (platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground hover:text-primary transition-all hover:-translate-y-1"
                >
                  {platform}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
