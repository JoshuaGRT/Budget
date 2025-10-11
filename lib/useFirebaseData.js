import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const useFirebaseData = (user, key, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  // Charger les données depuis Firestore
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setData(initialValue);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData[key]) {
            setData(userData[key]);
          } else {
            setData(initialValue);
          }
        } else {
          setData(initialValue);
        }
      } catch (error) {
        console.error('Erreur de chargement:', error);
        setData(initialValue);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, key]);

  // Sauvegarder les données dans Firestore
  const saveData = async (newData) => {
    setData(newData);

    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, { [key]: newData }, { merge: true });
      } catch (error) {
        console.error('Erreur de sauvegarde:', error);
      }
    }
  };

  return [data, saveData, loading];
};