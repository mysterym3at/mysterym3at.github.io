// src/components/Handbags.jsx

import React, { useState, useEffect } from "react";
import HandbagService from "../services/handbagService";

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

const emptyDesign = {
  name: "",
  shape: "",
  price: "",
  categories: [],
  imageUrls: [],
  favourite: false,
};

const Handbags = () => {
  const [handbags, setHandbags] = useState([]);

  // Form fields for adding/editing handbags
  const [name, setName] = useState("");
  const [season, setSeason] = useState("");
  const [range, setRange] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [pin, setPin] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [version, setVersion] = useState("");
  const [themes, setThemes] = useState("");
  const [categories, setCategories] = useState("");
  const [designs, setDesigns] = useState([ { ...emptyDesign } ]);
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
    setCategories((handbag.categories || []).join(", "));
    setDesigns(
      (handbag.variations?.design && handbag.variations.design.length > 0)
        ? handbag.variations.design.map(d => ({
            name: d.name || "",
            shape: d.shape || "",
            price: d.price != null ? d.price.toString() : "",
            categories: Array.isArray(d.categories) ? d.categories : (d.categories ? [d.categories] : []),
            imageUrls: Array.isArray(d.imageUrls) ? d.imageUrls : (d.imageUrl ? [d.imageUrl] : []),
            favourite: d.favourite || false,
          }))
        : [ { ...emptyDesign } ]
    );
  };

  // Add or update handbag document
  const handleAddOrUpdateHandbag = async () => {
    if (!name) return alert("Handbag name is required");
    const cleanDesigns = designs
      .filter(d =>
        d.name ||
        d.shape ||
        d.price ||
        (Array.isArray(d.categories) && d.categories.length) ||
        (Array.isArray(d.imageUrls) && d.imageUrls.length)
      )
      .map(d => ({
        name: typeof d.name === "string" ? d.name.trim() : "",
        shape: typeof d.shape === "string" ? d.shape.trim() : "",
        price: parseFloat(d.price) || 0,
        categories: Array.isArray(d.categories) ? d.categories.filter(Boolean) : [],
        imageUrls: Array.isArray(d.imageUrls) ? d.imageUrls.filter(Boolean) : [],
        favourite: d.favourite || false,
      }));
    const variations = {
      color: colors.split(",").map(c => c.trim()).filter(Boolean),
      size: sizes.split(",").map(s => s.trim()).filter(Boolean),
      version: version.trim() || null,
      theme: themes.split(",").map(t => t.trim()).filter(Boolean),
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
      pin: pin.trim(),
      variations,
      favourite: editingIdFavourite,
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
    setDesigns([ { ...emptyDesign } ]);
  };

  // Handle input changes for design objects
  const handleDesignChange = (index, field, value) => {
    const updatedDesigns = [...designs];
    updatedDesigns[index][field] = value;
    setDesigns(updatedDesigns);
  };

  // Add a new empty design
  const addDesign = () => {
    setDesigns([...designs, { ...emptyDesign }]);
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

  // Toggle favourite for a single design & persist to Firestore
  const toggleDesignFavourite = async (handbagId, designIndex) => {
    try {
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
          h.id === handbagId
            ? { ...h, variations: { ...h.variations, design: updatedDesigns } }
            : h
        )
      );
      await HandbagService.updateHandbag(handbagId, updatedHandbagData);
    } catch (error) {
      console.error("Failed to toggle design favourite:", error);
    }
  };

  // JSX starts here
  return (
    <div>
      <h2>{editingId ? "Edit" : "Add"} Handbag</h2>
      {/* Handbag Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddOrUpdateHandbag();
        }}
      >
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Handbag Name" required />
        <input value={season} onChange={e => setSeason(e.target.value)} placeholder="Season" />
        <input value={range} onChange={e => setRange(e.target.value)} placeholder="Range" />
        <input value={releaseDate} onChange={e => setReleaseDate(e.target.value)} placeholder="Release Date" />
        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <input value={video} onChange={e => setVideo(e.target.value)} placeholder="Video" />
        <input value={pin} onChange={e => setPin(e.target.value)} placeholder="Pin" />
        <input value={colors} onChange={e => setColors(e.target.value)} placeholder="Colors (comma separated)" />
        <input value={sizes} onChange={e => setSizes(e.target.value)} placeholder="Sizes (comma separated)" />
        <input value={version} onChange={e => setVersion(e.target.value)} placeholder="Version" />
        <input value={themes} onChange={e => setThemes(e.target.value)} placeholder="Themes (comma separated)" />
        <input value={categories} onChange={e => setCategories(e.target.value)} placeholder="Categories (comma separated)" />
        {/* Designs */}
        <h3>Designs</h3>
        {designs.length === 0 && <p>No designs available</p>}
        {designs.map((design, index) => (
          <div key={index}>
            <input
              value={design.name}
              onChange={e => handleDesignChange(index, "name", e.target.value)}
              placeholder="Design Name"
            />
            <input
              value={design.shape}
              onChange={e => handleDesignChange(index, "shape", e.target.value)}
              placeholder="Shape"
            />
            <input
              value={design.price}
              onChange={e => handleDesignChange(index, "price", e.target.value)}
              placeholder="Price"
              type="number"
              min="0"
            />
            <input
              value={design.categories.join(", ")}
              onChange={e =>
                handleDesignChange(
                  index,
                  "categories",
                  e.target.value.split(",").map(x => x.trim()).filter(Boolean)
                )
              }
              placeholder="Categories (comma separated)"
            />
            <input
              value={design.imageUrls.join(", ")}
              onChange={e =>
                handleDesignChange(
                  index,
                  "imageUrls",
                  e.target.value.split(",").map(x => x.trim()).filter(Boolean)
                )
              }
              placeholder="Image URLs (comma separated)"
            />
            <label>
              Favourite
              <input
                type="checkbox"
                checked={!!design.favourite}
                onChange={() => handleDesignChange(index, "favourite", !design.favourite)}
              />
            </label>
            <button type="button" onClick={() => removeDesign(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addDesign}>Add Design</button>
        <div>
          <button type="submit">{editingId ? "Update" : "Add"} Handbag</button>
          <button type="button" onClick={resetForm}>Reset</button>
        </div>
      </form>
      <hr />
      <h2>Handbags</h2>
      <ul>
        {handbags.map((handbag) => (
          <li key={handbag.id}>
            <strong>{handbag.name}</strong> - {handbag.season} (£{gbpFormatter.format(handbag.variations?.design?.[0]?.price || 0)})
            <button onClick={() => startEdit(handbag)}>Edit</button>
            <button onClick={() => toggleHandbagFavourite(handbag)}>
              {handbag.favourite ? "★" : "☆"}
            </button>
            <div>
              <h4>Designs</h4>
              {(handbag.variations?.design || []).map((design, dIdx) => (
                <div key={dIdx} style={{ border: "1px solid #ccc", margin: "8px", padding: "8px" }}>
                  <div>
                    <span>
                      <strong>{design.name}</strong> ({design.shape}) - £{gbpFormatter.format(design.price)}
                    </span>
                    <button onClick={() => toggleDesignFavourite(handbag.id, dIdx)}>
                      {design.favourite ? "★" : "☆"}
                    </button>
                  </div>
                  <div>
                    <span>Categories: {Array.isArray(design.categories) ? design.categories.join(", ") : design.categories}</span>
                  </div>
                  <div>
                    Images: {Array.isArray(design.imageUrls) && design.imageUrls.length
                      ? design.imageUrls.map((imgUrl, iIdx) => (
                          <img key={iIdx} src={imgUrl} alt="design" width={60} style={{ marginRight: "4px" }} />
                        ))
                      : "No images"}
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Handbags;
