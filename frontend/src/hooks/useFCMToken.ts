// src/hooks/useFCMToken.ts
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../config/firebase.config';


import toast from 'react-hot-toast';

import { authService } from '@/features/auth/service/authService';

export const useFCMToken = () => {
  const initFCM = async () => {
    try {
      if (!('serviceWorker' in navigator)) {
        console.warn('Service workers not supported');
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .catch((err) => {
          console.error('SW registration failed:', err);
          throw err;
        });
     await navigator.serviceWorker.ready;
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        
       const fcmToken= await authService.fcmToken(token);
        if(!fcmToken) {
          console.log('no Fcm_token saved');
        }
      }else {
        console.warn('No FCM token returned');
      }


      onMessage(messaging, (payload) => {
        const title = payload.notification?.title ?? 'Notification';
        const body = payload.notification?.body ?? '';
        //1.  taost message
        toast.success(`${payload.notification?.title}: ${payload.notification?.body}`,
          {
            duration: 6000,
          position: 'top-right',
          style: {
            background: '#ffff',
            color: '#227008',
            boxShadow: '0 0 0 0.5px #166534',
            borderRadius: '8px',
            zIndex: 99999,
          },
          icon: '📨',
        });


            
       
        
        // 2. System notification (same as background)
        if (Notification.permission === 'granted') {
            console.log(Notification.permission);
          registration.showNotification(title, {
            body,
            icon: '/sportfithub_logo.png',
            data: payload.data,  
          });
        }
      });

    } catch (error) {
      console.error('FCM init failed:', error);
    }
  };

  return { initFCM };
};