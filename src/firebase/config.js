import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  databaseURL: "https://qnqqanlytask-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "qnqqanlytask-default-rtdb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app);
export default app;
