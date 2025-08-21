import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

export async function saveImageMetadataToFirestore(imageData) {
  const docRef = db.collection('images').doc(imageData.id);
  await docRef.set({
    id: imageData.id,
    filename: imageData.filename,
    uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    variants: imageData.variants
  });
}
