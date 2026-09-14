import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

 
// const serviceAccount = require('./serviceAccountKey.json');


const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};
admin.initializeApp({
  credential: cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
