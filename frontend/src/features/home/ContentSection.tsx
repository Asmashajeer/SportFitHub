import Button from "../../components/.ui.compo/Button"; 

interface ContentSectionProps {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  imageAlt: string; 
  isDarker?: boolean; 
  reverse: boolean;
}

const ContentSection = ({
  id,
  title,
  description,
  buttonText,
  imageUrl,
  imageAlt,
  isDarker,
  reverse,
}: ContentSectionProps) => {
  return (
    /* Use your theme's background and secondary colors instead of gray-900 */
    <section 
      id={id} 
      className={`py-24 ${isDarker ? 'bg-background' : 'bg-secondary/30'} text-foreground transition-colors`}
    >
      {/* Use your custom utility from index.css */}
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className={`${reverse ? "md:order-2" : "md:order-1"}`}>
            {/* Added Outfit font and your neon primary color for the header */}
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 font-sans tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed text-lg">
              {description}
            </p>
            
           
            <Button variant="primary" size='md'>
              {buttonText}
            </Button>
          </div>
          
          {/* Image Content */}
          <div className={`${reverse ? "md:order-1" : "md:order-2"}`}>
            {/* Using your card and border tokens */}
            <div className="relative group">
          
              <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-2xl group-hover:bg-primary/30 transition duration-500"></div>
              
              <div className="relative bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src={imageUrl} 
                  alt={imageAlt} 
                  className="w-full h-100 object-cover grayscale-30 group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

/* --- Specific Sections --- */

export const SportsSection = () => (
  <ContentSection 
    id="sports"
    title="Elite Coaching. Master Your Sport."
    description="Whether you're looking to improve your soccer skills, dominate on the basketball court, or perfect your tennis serve, our expert coaches are here to guide you."
    buttonText="Explore Sports"
    imageUrl="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop"
    imageAlt="Sports Training"
    isDarker={true} // Using theme logic instead of bg-gray-900
    reverse={true}
  />
);

export const FitnessSection = () => (
  <ContentSection 
    id="fitness"
    title="Seamless Fitness: Gym to Living Room."
    description="Access world-class fitness programs wherever you are. From strength training to yoga, our comprehensive library ensures you maintain your routine."
    buttonText="Explore Fitness"
    imageUrl="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop"
    imageAlt="Fitness Training"
    isDarker={false} // Subtle background change
    reverse={false}
  />
);

export const CampSection = () => (
  <ContentSection 
    id="camps"
    title="Elite Training Camps."
    description="Join our intensive training camps where champions are made. Experience professional-level coaching and connect with fellow athletes."
    buttonText="Explore Camps"
    imageUrl="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop"
    imageAlt="Training Camp"
    isDarker={true}
    reverse={true}
  />
);
