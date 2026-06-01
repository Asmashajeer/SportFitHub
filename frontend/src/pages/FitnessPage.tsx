import Header from '../components/layout/Header';

import Footer from '../components/layout/Footer';
import PublicFitnessSessions from '@/features/session/component/fitnessSession/PublicFitnessSessions';

const FitnessPage = () => {
  return (
    <div>
      <Header />

      <main>
        <PublicFitnessSessions />
      </main>
      <Footer />
    </div>
  );
};

export default FitnessPage;
