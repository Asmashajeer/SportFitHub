

const Footer = () => {
  return (
    /* 1. Using themed background and top border */
    <footer className="bg-background border-t border-border py-16 transition-colors">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-black tracking-tighter mb-4 font-sans uppercase">
              <span className="text-gradient-primary">SportFit</span>Hub
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Transforming athletes through elite coaching, personalized training, 
              and a high-performance community.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-bold uppercase tracking-widest text-xs mb-6">Quick Links</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#sports" className="hover:text-primary transition-colors">Sports</a></li>
              <li><a href="#fitness" className="hover:text-primary transition-colors">Fitness</a></li>
              <li><a href="#camps" className="hover:text-primary transition-colors">Camps</a></li>
            </ul>
          </div>
          
          {/* Programs */}
          <div>
            <h4 className="text-foreground font-bold uppercase tracking-widest text-xs mb-6">Programs</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Youth Training</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Adult Fitness</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Elite Camps</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Online Coaching</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-foreground font-bold uppercase tracking-widest text-xs mb-6">Support Us</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-xs font-medium">
            © {new Date().getFullYear()} <span className="text-foreground">SportFitHub</span>. All rights reserved.
          </p>
          
          <div className="flex space-x-8">
            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => (
              <a 
                key={platform}
                href="#" 
                className="text-xs font-bold uppercase tracking-tighter text-muted-foreground hover:text-primary transition-all hover:-translate-y-1"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;