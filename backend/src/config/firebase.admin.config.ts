import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
