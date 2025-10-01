import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBY58fWwR2LcQsiFt61eTQ9DenMA2xRYQ0",
  authDomain: "budget-dashboard-2586e.firebaseapp.com",
  projectId: "budget-dashboard-2586e",
  storageBucket: "budget-dashboard-2586e.firebasestorage.app",
  messagingSenderId: "385505872083",
  appId: "1:385505872083:web:55a80167bbf6db4b5e2c26"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

export const sauvegarderDonnees = async (donnees) => {
  try {
    await setDoc(doc(db, 'budgets', 'main'), {
      ...donnees,
      lastUpdated: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
    return { success: false, error };
  }
};

export const chargerDonnees = async () => {
  try {
    const docRef = doc(db, 'budgets', 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, message: 'Aucune données' };
    }
  } catch (error) {
    console.error('Erreur chargement:', error);
    return { success: false, error };
  }
};
