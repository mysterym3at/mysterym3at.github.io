// updateHandbagsFromJson.js

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Replace with your own Firebase Admin SDK service account JSON filepath
const serviceAccount = require("./path/to/serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Replace with your JSON export filepath
const jsonFilePath = path.join(__dirname, "handbags-export.json");

// Main update function
async function updateHandbagsFromJson() {
  try {
    const rawData = fs.readFileSync(jsonFilePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    // Convert JSON data to an array of { id, ...data }
    let handbagsArray;
    if (Array.isArray(jsonData)) {
      handbagsArray = jsonData; // Array of objects with 'id' field
    } else {
      handbagsArray = Object.entries(jsonData).map(([id, data]) => ({ id, ...data }));
    }

    for (const handbag of handbagsArray) {
      const { id, ...handbagData } = handbag;
      if (!id) {
        console.warn("Skipping entry without an ID:", handbag);
        continue;
      }

      const docRef = db.collection("handbags").doc(id);

      // Merge update or create the document if missing
      await docRef.set(handbagData, { merge: true });
      console.log(`Successfully updated/created handbag with ID: ${id}`);
    }

    console.log("✅ All handbags have been updated/created from the JSON file.");
  } catch (error) {
    console.error("❌ Error updating handbags from JSON:", error);
  }
}

// Run the script
updateHandbagsFromJson();
