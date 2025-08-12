import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust path to your firebase config

const HandbagsJsonViewer = () => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHandbags() {
      try {
        const snapshot = await getDocs(collection(db, "handbags"));
        const data = {};
        snapshot.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        setJsonData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch handbags");
      } finally {
        setLoading(false);
      }
    }

    fetchHandbags();
  }, []);

  // Function to trigger download of JSON file
  const downloadJsonFile = () => {
    if (!jsonData) return;

    const fileName = "handbags-export.json";
    const jsonStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // Create a temporary anchor tag with download attribute and click it programmatically
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the object URL memory
    URL.revokeObjectURL(href);
  };

  if (loading) return <p>Loading handbags JSON...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Handbags Collection JSON</h3>
      <button
        onClick={downloadJsonFile}
        style={{
          marginBottom: "1rem",
          padding: "8px 16px",
          fontSize: "1rem",
          cursor: "pointer",
          backgroundColor: "#0069d9",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Download JSON
      </button>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: "500px",
          overflowY: "auto",
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          borderRadius: "4px",
        }}
      >
        {JSON.stringify(jsonData, null, 2)}
      </pre>
    </div>
  );
};

export default HandbagsJsonViewer;
