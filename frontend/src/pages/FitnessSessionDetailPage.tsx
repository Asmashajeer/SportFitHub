import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import FitnessSessionDetail from '@/features/session/component/fitnessSession/FitnessSessionDetail';

const FitnessSessionDetailPage = () => {
  return (
    <div>
      <Header />

      <main>
        <FitnessSessionDetail />
      </main>
      <Footer />
    </div>
  );
};

export default FitnessSessionDetailPage;
