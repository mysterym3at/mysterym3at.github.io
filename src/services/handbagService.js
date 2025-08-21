// src/services/handbagService.js

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase"; 




const handbagsCollectionRef = collection(db, "handbags");

const HandbagService = {
  // Fetch all handbags from Firestore
  getAllHandbags: async () => {
    const snapshot = await getDocs(handbagsCollectionRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Fetch a single handbag by document ID
  getHandbagById: async (id) => {
    const docRef = doc(db, "handbags", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Handbag not found with ID: " + id);
    }
  },

  // Add a new handbag document
  addHandbag: async (handbagData) => {
    const docRef = await addDoc(handbagsCollectionRef, handbagData);
    return docRef.id;
  },

  // Update existing handbag document by ID
  updateHandbag: async (id, handbagData) => {
    const docRef = doc(db, "handbags", id);
    // Use updateDoc if you want to patch fields selectively, or setDoc for full overwrite
    await updateDoc(docRef, handbagData);
  },

  // Delete a handbag document by ID
  deleteHandbag: async (id) => {
    const docRef = doc(db, "handbags", id);
    await deleteDoc(docRef);
  },

  // Optional: Query handbags by theme (example)
  queryHandbagsByTheme: async (theme) => {
    const q = query(handbagsCollectionRef, where("variations.themes", "array-contains", theme));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
};

export default HandbagService;
