import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbDcSsufFrv0JEcwPVXdzB6tyVzhMKGCo",
  authDomain: "budget-76301.firebaseapp.com",
  projectId: "budget-76301",
  storageBucket: "budget-76301.firebasestorage.app",
  messagingSenderId: "555057152491",
  appId: "1:555057152491:web:71b1f76c90503fe66bd9ae",
  measurementId: "G-8T5H1YFNT7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;