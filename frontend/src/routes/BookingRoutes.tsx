import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '@/components/reusable/LoadingScreen';
const BookingSuccess=lazy (()=>import (  '@/features/booking/component/BookingSuccess'));
const CheckoutPage=lazy (()=>import ( '@/features/booking/component/Checkout'));


const BookingRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>       
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/booking-success" element={<BookingSuccess />} />    
      </Routes>
    </Suspense>
  );
};
export default BookingRoutes;
