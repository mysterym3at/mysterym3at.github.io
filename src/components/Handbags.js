// src/components/Handbags.jsx

import React, { useState, useEffect } from "react";
import HandbagService from "../services/handbagService";

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

const Handbags = () => {
  const [handbags, setHandbags] = useState([]);

  // Form fields for adding/editing handbags
   // Basic handbag fields
   const [name, setName] = useState("");
   const [season, setSeason] = useState("");
   const [range, setRange] = useState("");
   const [releaseDate, setReleaseDate] = useState("");
   const [imageUrl, setImageUrl] = useState("");
   const [description, setDescription] = useState("");
   const [video, setVideo] = useState("");
    const [pin, setPin] = useState("");
   // Variations states
   const [colors, setColors] = useState("");
   const [sizes, setSizes] = useState("");
   const [version, setVersion] = useState("");
   const [themes, setThemes] = useState(""); 
   const [categories, setCategories] = useState(""); 
 
   // Designs (with shape instead of style)
   const [designs, setDesigns] = useState([
     { name: "", shape: "", price: "", category: "", imageUrl: "", categories: categories, favourite: false}
   ]);

  const [editingId, setEditingId] = useState(null);
  const [editingIdFavourite, setEditingIdFavourite] = useState(false);

  useEffect(() => {
    fetchHandbags();
  }, []);

  // Fetch all handbags from Firestore
  const fetchHandbags = async () => {
    try {
      const data = await HandbagService.getAllHandbags();
      setHandbags(data);
    } catch (error) {
      console.error("Failed to fetch handbags:", error);
    }
  };

  // Prefill form for editing
const startEdit = (handbag) => {
    setEditingId(handbag.id);
    setName(handbag.name);
    setSeason(handbag.season || "");
    setRange(handbag.range || "");
    setReleaseDate(handbag.releaseDate || "");
    setImageUrl(handbag.imageUrl || "");
    setDescription(handbag.description || "");
    setVideo(handbag.video || "");
    setPin(handbag.pin || "");
   
    setColors((handbag.variations?.color || []).join(", "));
    setSizes((handbag.variations?.size || []).join(", "));
    setVersion(handbag.variations?.version || "");
    setThemes((handbag.variations?.theme || []).join(", "));
    setEditingIdFavourite(handbag.favourite || false);
    //setCategories((handbag.categories || []).join(", "));

    setDesigns(
      (handbag.variations?.design && handbag.variations.design.length > 0)
        ? handbag.variations.design.map(d => ({
            name: d.name || "",
            shape: d.shape || "",
            price: d.price != null ? d.price.toString() : "",
            category: d.category || "",
            imageUrl: d.imageUrl || "",
            categories: d.categories || "",
            favourite: d.favourite || false,
          }))
        : [{ name: "", shape: "", price: "", category: "", imageUrl: "", categories:"" , favourite:false}]
    );
  };
 

  // Add or update handbag document
  const handleAddOrUpdateHandbag = async () => {
    if (!name) return alert("Handbag name is required");

 const cleanDesigns = designs
  .filter(d => d.name || d.shape || d.price || d.category || d.imageUrl || d.categories)
  .map(d => ({
    name: typeof d.name === "string" ? d.name.trim() : "",
    shape: typeof d.shape === "string" ? d.shape.trim() : "",
    price: parseFloat(d.price) || 0,
    category: typeof d.category === "string" ? d.category.trim() : "",
    imageUrl: typeof d.imageUrl === "string" ? d.imageUrl.trim() : "",
    categories: typeof d.categories === "string" ? d.categories.trim() : "",
    favourite: d.favourite || false,
  }));



    const variations = {
      color: colors.split(",").map((c) => c.trim()).filter(Boolean),
      size: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      version: version.trim() || null,
      theme:themes.split(",").map(t => t.trim()).filter(Boolean),
      design: cleanDesigns,
    };

    const handbagData = {
       name,
        season: season.trim(),
        range: range.trim(),
        releaseDate: releaseDate || null,
        imageUrl: imageUrl.trim(),
        description: description.trim(),
        video: video.trim(),
       pin:pin.trim(),
        variations,
        favourite: editingIdFavourite
    };

    try {
      if (editingId) {
        await HandbagService.updateHandbag(editingId, handbagData);
      } else {
        await HandbagService.addHandbag(handbagData);
      }
      resetForm();
      fetchHandbags();
    } catch (error) {
      console.error("Error saving handbag:", error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setEditingId(null);
    setEditingIdFavourite(false);
    setName("");
    setSeason("");
    setRange("");
    setReleaseDate("");
    setImageUrl("");
    setDescription("");
    setVideo("");
   setPin("");
    setColors("");
    setSizes("");
    setVersion("");
    setThemes("");

    setDesigns([{ name: "", shape: "", price: "", category: "", imageUrl: "" , categories:"", favourite:false}]);
  };

  // Handle input changes for design objects
  const handleDesignChange = (index, field, value) => {
    const updatedDesigns = [...designs];
    updatedDesigns[index][field] = value;
    setDesigns(updatedDesigns);
  };

  // Add a new empty design
   const addDesign = () => {
    setDesigns([...designs, { name: "", shape: "", price: "", category: "", imageUrl: "",categories:"" , favourite: false}]);
  };
  // Remove a design by index
  const removeDesign = (index) => {
    setDesigns(designs.filter((_, i) => i !== index));
  };

  // Toggle favourite status for handbag
  const toggleHandbagFavourite = async (handbag) => {
    try {
      await HandbagService.updateHandbag(handbag.id, {
        ...handbag,
        favourite: !handbag.favourite,
      });
      fetchHandbags();
    } catch (error) {
      console.error("Failed to toggle handbag favourite:", error);
    }
  };

  // Immediately toggle favourite for a single design & persist to Firestore
  const toggleDesignFavourite = async (handbagId, designIndex) => {
    try {
      // Find handbag & designs
      const handbag = handbags.find((h) => h.id === handbagId);
      if (!handbag) return;

      const updatedDesigns = [...(handbag.variations?.design || [])];
      const currentFavourite = updatedDesigns[designIndex]?.favourite ?? false;

      updatedDesigns[designIndex] = {
        ...updatedDesigns[designIndex],
        favourite: !currentFavourite,
      };

      const updatedHandbagData = {
        ...handbag,
        variations: {
          ...handbag.variations,
          design: updatedDesigns,
        },
      };

      // Optimistic UI update
      setHandbags((prev) =>
        prev.map((h) =>
          h.id === handbagId ? { ...h, variations: { ...h.variations, design: updatedDesigns } } : h
        )
      );

      await HandbagService.updateHandbag(handbagId, updatedHandbagData);
    } catch (error) {
      console.error("Failed to toggle design favourite:", error);
      // Optionally rollback optimistic UI on error
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Vendula London Handbags</h2>

      {/* Handbag Form */}
      <input
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        placeholder="design name"
        value={name}
        onChange={e => setName(e.target.value)}
      />


      <input
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        placeholder="Season (e.g., Spring, Winter)"
        value={season}
        onChange={e => setSeason(e.target.value)}
      />

      <input
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        placeholder="Range (e.g., Tote, Satchel, Clutch)"
        value={range}
        onChange={e => setRange(e.target.value)}
      />
      <input
        type="date"
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        placeholder="Release Date"
        value={releaseDate}
        onChange={(e) => setReleaseDate(e.target.value)}
      />

  
    
      <input
        style={{ width: "100%", padding: 8, marginBottom: 20 }}
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
       <input
        style={{ width: "100%", padding: 8, marginBottom: 20 }}
        placeholder="Description"
        value={description} // array to string
        onChange={e => setDescription(e.target.value)}
      />
 <input
        style={{ width: "100%", padding: 8, marginBottom: 20 }}
        placeholder="Video"
        value={video} // array to string
        onChange={e => setVideo(e.target.value)}
      />
 <input
        style={{ width: "100%", padding: 8, marginBottom: 20 }}
        placeholder="Pin"
        value={pin} // array to string
        onChange={e => setPin(e.target.value)}
      />


      <input
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        placeholder="Colors (comma separated)"
        value={colors}
        onChange={(e) => setColors(e.target.value)}
      />

      <input
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        placeholder="Sizes (comma separated)"
        value={sizes}
        onChange={(e) => setSizes(e.target.value)}
      />

      <input
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        placeholder="Version"
        value={version}
        onChange={e => setVersion(e.target.value)}
      />

  
      <input
        style={{ width: "100%", padding: 8, marginBottom: 20 }}
        placeholder="Themes (comma separated)"
        value={themes} // array to string
        onChange={e => setThemes(e.target.value)}
      />

      {/* Designs Form */}
      <h3>Designs</h3>
      {designs.map((design, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
              gap: 8,
            }}
          >
            <input
              style={{ flex: 1, padding: 6 }}
              placeholder="Design Name"
              value={design.name}
              onChange={(e) => handleDesignChange(index, "name", e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                const updatedDesigns = [...designs];
                updatedDesigns[index].favourite = !updatedDesigns[index].favourite;
                setDesigns(updatedDesigns);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 24,
                color: design.favourite ? "gold" : "#ccc",
                userSelect: "none",
                padding: 0,
              }}
              aria-label={design.favourite ? "Unfavourite design" : "Favourite design"}
              title={design.favourite ? "Unfavourite design" : "Favourite design"}
            >
              {design.favourite ? "★" : "☆"}
            </button>
          </div>

          <input
            style={{ width: "100%", padding: 6, marginBottom: 8 }}
            placeholder="Shape"
            value={design.shape}
            onChange={(e) => handleDesignChange(index, "shape", e.target.value)}
          />
          <input
            style={{ width: "100%", padding: 6, marginBottom: 8 }}
            type="number"
            placeholder="Price (GBP)"
            value={design.price}
            onChange={(e) => handleDesignChange(index, "price", e.target.value)}
          />
          <input
            style={{ width: "100%", padding: 6, marginBottom: 8 }}
            placeholder="Category"
            value={design.category}
            onChange={(e) => handleDesignChange(index, "category", e.target.value)}
          />
          <input
            style={{ width: "100%", padding: 6, marginBottom: 8 }}
            placeholder="Image URL"
            value={design.imageUrl}
            onChange={(e) => handleDesignChange(index, "imageUrl", e.target.value)}
          />
          {designs.length > 1 && (
            <button
              style={{
                backgroundColor: "#d9534f",
                color: "white",
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
              }}
              onClick={() => removeDesign(index)}
              type="button"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        style={{
          padding: "10px 20px",
          marginBottom: 20,
          cursor: "pointer",
          backgroundColor: "#8B0000",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
        onClick={addDesign}
        type="button"
      >
        Add Another Design
      </button>

      <br />

      <button
        style={{
          padding: "12px 30px",
          cursor: "pointer",
          backgroundColor: "#0069d9",
          color: "white",
          border: "none",
          borderRadius: 5,
        }}
        onClick={handleAddOrUpdateHandbag}
      >
        {editingId ? "Update Handbag" : "Add Handbag"}
      </button>

      <hr style={{ margin: "30px 0" }} />

      {/* Handbag list display */}
      <h3>Vendula Collection List</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {handbags.map((h) => (
          <li
            key={h.id}
            style={{ marginBottom: 25, paddingBottom: 15, borderBottom: "1px solid #ccc" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
               {h.id}
               <strong style={{ fontSize: 18 }}>  {h.name}</strong> <i style={{ fontSize: 14, width:10 }}>{h.season || "N/A"}</i> {h.favourite && "⭐"}
              
              </div>
              <div>
                <button
                  style={{ cursor: "pointer", marginRight: 10 }}
                  onClick={() => toggleHandbagFavourite(h)}
                  type="button"
                >
                  {h.favourite ? "Unfavourite" : "Favourite"}
                </button>
                <button style={{ cursor: "pointer" }} onClick={() => startEdit(h)} type="button">
                  Edit
                </button>
              </div>
            </div>

           
             <div>Range: {h.range || "N/A"}</div>
              {/* <div>Description: {h.variations?.description || "N/A"}</div> */}
            <div>Release Date: {h.releaseDate ? new Date(h.releaseDate).toLocaleDateString() : "N/A"}</div>
            <div>
               {/* <div>Release Date: {h.releaseDate ? new Date(h.releaseDate).toLocaleDateString() : "N/A"}</div> */}
            {/* <div>Image URL: {h.imageUrl ? (<a href={h.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a>) : "N/A"}</div> */}
           
            <div>Colors: {(h.variations?.color || []).join(", ") || "N/A"}</div>
            {/* <div>Sizes: {(h.variations?.size || []).join(", ") || "N/A"}</div> */}
            <div>Themes: {(h.variations?.theme || []).join(", ") || "N/A"}</div>
            {/* <div>Version: {h.variations?.version || "N/A"}</div> */}
            {/* <div>Description: {h.variations?.description || "N/A"}</div> */}
       
         {h.pin && (
                      
                        <a
                          href={h.pin} >
        {h.imageUrl && (
                      
                        <img
                          src={h.imageUrl}
                          alt={h.name}
                          style={{ width: 250, marginLeft: 15, borderRadius: 4, objectFit: "cover" }}
                        />
                      )}

                         </a>
                          
                          
                      
                      )}


 {h.video && (
    <iframe 
    width="560" 
    height="315" 
    src={h.video}
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>

    </iframe>
                      
                        
                          
                      
                      )}
                   
              {/* Image URL:{" "}
              {h.imageUrl ? (
                <a href={h.imageUrl} target="_blank" rel="noopener noreferrer">
                  View Image
                </a>
              ) : (
                "N/A"
              )} */}
            </div>
           

            <div style={{ marginTop: 10 }}>
              <strong>Designs:</strong>
              {h.variations?.design && h.variations.design.length > 0 ? (
                <ul style={{ marginTop: 5 }}>
                  {h.variations.design.map((design, idx) => (
                    <li key={idx} style={{ marginBottom: 10, display: "flex", alignItems: "left" ,  flexDirection: "column"}}>
                      <div style={{  display: "flex", alignItems: "left" , justifyContent:"left",flexDirection: "row"}} >

                   
                      <button
                        type="button"
                        onClick={() => toggleDesignFavourite(h.id, idx)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 20,
                          marginRight: 8,
                          color: design.favourite ? "blue" : "#ccc",
                          userSelect: "none",
                          padding: 0,
                        }}
                        aria-label={design.favourite ? "Unfavourite design" : "Favourite design"}
                        title={design.favourite ? "Unfavourite design" : "Favourite design"}
                      >
                        {design.favourite ? "★" : "☆"}
                      </button>
                   <span>
                       <strong>{design.name || "N/A"}</strong> <br /> Shape: {design.shape || "N/A"},Price:{" "}
                        {gbpFormatter.format(design.price)}, Category: {design.category || "N/A"}
                     </span>
                       </div>

                         <div style={{  display: "flex", alignItems: "center" , justifyContent:"center"}} >

                      {design.imageUrl && (
                      
                        <img
                          src={design.imageUrl}
                          alt={design.name}
                          style={{ width: 180, marginLeft: 15, borderRadius: 4, objectFit: "cover" }}
                        />
                      )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No designs available</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Handbags;
