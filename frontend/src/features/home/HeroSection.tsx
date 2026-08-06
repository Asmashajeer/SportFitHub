
import { Button } from '@/components/ui/Button';

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-app-bg text-app-text flex items-center pt-20 overflow-hidden"
    >
      {/* Glow Blobs - Using your primary color variable */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-125 h-125 bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          {/* Headline */}
          <h3 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter uppercase italic">
            Transform Your <br />
            <span className="bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Game
            </span>
            , <br />
            Transform Your Life
          </h3>

          {/* Subtext - Using slate-400 to match your placeholder style */}
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl font-medium leading-relaxed">
            Elite coaching, personalized training plans, and a high-performance
            community that pushes you to exceed your limits.
          </p>

          {/* CTA Buttons - Utilizing your .btn-primary and .btn-secondary */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
              <Button variant="primary" className="text-lg py-4">
                {isAuthenticated ? "Go to Dashboard" : "Explore Now"}
              </Button>
            </Link> */}

            
              <Button variant="ghost" size="lg" className="border-2"  
              onClick={() => {
                  document.getElementById('Sports')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Our Programs
              </Button>
           
          </div>
        </div>
      </div>

      {/* Decorative side element */}
      <div className="absolute right-0 bottom-0 opacity-[0.03] select-none pointer-events-none hidden lg:block">
        <h2 className="text-[250px] font-black leading-none text-primary translate-y-1/4 translate-x-1/4 italic">
          FIT
        </h2>
      </div>
    </section>
  );
};

export default HeroSection;
