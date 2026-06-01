import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SessionDetail from '@/features/session/component/sportSession/SessionDetail';

const SessionDetailPage = () => {
  return (
    <div>
      <Header />

      <main>
        <SessionDetail />
      </main>
      <Footer />
    </div>
  );
};

export default SessionDetailPage;
