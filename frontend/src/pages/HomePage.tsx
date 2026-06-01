import Header from '../components/layout/Header';
import HeroSection from '../features/home/HeroSection';
import {
  SportsSection,
  FitnessSection,
  CampSection,
} from '../features/home/ContentSection';
import Footer from '../components/layout/Footer';
const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <HeroSection />
        <SportsSection />
        <FitnessSection />
        <CampSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
