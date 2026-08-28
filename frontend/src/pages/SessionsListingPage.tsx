
import SessionsListing from '@/features/session/component/SessionsListing';
import { Footer } from 'react-day-picker';
import Header from '@/components/layout/Header';

const SessionsListingPage = () => {
    return (
    <div>
      <Header />

      <main>
        <SessionsListing />
      </main>
      <Footer />
    </div>
  );
};
  

export default SessionsListingPage;