import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtu3Y_sClB3bNSsqlmccyqtvJP-RcVf4g",
  authDomain: "create-3x.firebaseapp.com",
  projectId: "create-3x",
  storageBucket: "create-3x.firebasestorage.app",
  messagingSenderId: "47680736291",
  appId: "1:47680736291:web:0d256e9b5a1c18f3343596",
  measurementId: "G-MN2MDHH8FW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;