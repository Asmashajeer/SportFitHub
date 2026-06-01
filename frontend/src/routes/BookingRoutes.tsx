import BookingSuccess from '@/features/booking/component/BookingSuccess';
import CheckoutPage from '@/features/booking/component/Checkout';
import { Route, Routes } from 'react-router-dom';

const BookingRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CheckoutPage />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
    </Routes>
  );
};
export default BookingRoutes;
