import Header from '../components/layout/Header';

import Footer from '../components/layout/Footer';

import PublicSportsSessions from '@/features/session/component/sportSession/PublicSportsSessions';

const SportsPage = () => {
  return (
    <div>
      <Header />

      <main>
        <PublicSportsSessions />
      </main>
      <Footer />
    </div>
  );
};

export default SportsPage;
