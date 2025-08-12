import React, { useEffect, useState } from "react";
import HandbagService from "../services/handbagService";

const HandbagSearch = () => {
  const [handbags, setHandbags] = useState([]);
  const [filteredHandbags, setFilteredHandbags] = useState([]);

  // Search inputs
  const [handbagNameSearch, setHandbagNameSearch] = useState("");
  const [designNameSearch, setDesignNameSearch] = useState("");

  // Fetch handbags on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await HandbagService.getAllHandbags();
        setHandbags(data);
        setFilteredHandbags(data);
      } catch (error) {
        console.error("Failed to fetch handbags:", error);
      }
    }
    fetchData();
  }, []);

  // Filtering + sorting effect - filter then sort by most recent releaseDate
  useEffect(() => {
    let filtered = [...handbags];

    if (handbagNameSearch.trim()) {
      const searchLower = handbagNameSearch.trim().toLowerCase();
      filtered = filtered.filter(
        (h) =>
          typeof h.name === "string" &&
          h.name.toLowerCase().includes(searchLower)
      );
    }

    if (designNameSearch.trim()) {
      const designSearchLower = designNameSearch.trim().toLowerCase();
      filtered = filtered.filter((h) => {
        const designs = h.variations?.design || [];
        return designs.some(
          (d) =>
            typeof d.name === "string" &&
            d.name.toLowerCase().includes(designSearchLower)
        );
      });
    }

    // Sort by releaseDate descending (most recent first)
    filtered.sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
      const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
      return dateB - dateA;
    });

    setFilteredHandbags(filtered);
  }, [handbags, handbagNameSearch, designNameSearch]);

  // Toggle favorite status of a design identified by design name
  const toggleDesignFavourite = async (handbagId, designName) => {
    try {
      // Optimistic update locally
      setHandbags((prevHandbags) =>
        prevHandbags.map((handbag) => {
          if (handbag.id !== handbagId) return handbag;

          const updatedDesigns = (handbag.variations?.design || []).map((design) =>
            design.name === designName
              ? { ...design, favourite: !design.favourite }
              : design
          );

          return {
            ...handbag,
            variations: {
              ...handbag.variations,
              design: updatedDesigns,
            },
          };
        })
      );

      // Persist to backend
      const handbagToUpdate = handbags.find((h) => h.id === handbagId);
      if (!handbagToUpdate) return;

      const updatedDesignsBackend = (handbagToUpdate.variations?.design || []).map(
        (design) =>
          design.name === designName
            ? { ...design, favourite: !design.favourite }
            : design
      );

      const updatedHandbagData = {
        ...handbagToUpdate,
        variations: {
          ...handbagToUpdate.variations,
          design: updatedDesignsBackend,
        },
      };

      await HandbagService.updateHandbag(handbagId, updatedHandbagData);
    } catch (error) {
      console.error("Failed to toggle design favourite:", error);
      // Optionally refetch or rollback optimistic UI here
    }
  };

  // Button to email list of favorites
  const EmailFavoritesButton = ({ handbags }) => {
    const handleEmailFavorites = () => {
      if (!handbags || handbags.length === 0) {
        alert("No handbags data available.");
        return;
      }

      const favoriteHandbags = handbags.filter((h) => h.favourite);
      const favoriteDesigns = handbags.flatMap((h) =>
        (h.variations?.design || []).filter((d) => d.favourite)
      );

      if (favoriteHandbags.length === 0 && favoriteDesigns.length === 0) {
        alert("No favorite handbags or designs to email.");
        return;
      }

      const subject = encodeURIComponent(
        "My Favorite Vendula London Handbags & Designs"
      );

      let body = "Here are my favorite handbags and designs:\n\n";

      if (favoriteHandbags.length > 0) {
        body += "Favorite Handbags:\n";
        favoriteHandbags.forEach((h) => {
          body += `- ${h.name}\n`;
        });
        body += "\n";
      }

      if (favoriteDesigns.length > 0) {
        body += "Favorite Designs:\n";
        favoriteDesigns.forEach((d) => {
          body += `- ${d.name} (Category: ${d.category || "N/A"}, Price: £${d.price || "0.00"})\n`;
        });
      }

      const mailtoLink = `mailto:?subject=${subject}&body=${encodeURIComponent(
        body
      )}`;

      window.location.href = mailtoLink;
    };

    return (
      <button
        onClick={handleEmailFavorites}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 20px",
          marginBottom: 20,
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 16,
        }}
        aria-label="Email your favorite handbags and designs"
      >
        Email Favorites
      </button>
    );
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Search Handbags and Designs</h2>

      {/* Handbag Name Search */}
      <input
        type="text"
        placeholder="Search handbags by name..."
        value={handbagNameSearch}
        onChange={(e) => setHandbagNameSearch(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 20, fontSize: 16 }}
        aria-label="Search handbags by name"
      />

      {/* Design Name Search */}
      <input
        type="text"
        placeholder="Search designs by name..."
        value={designNameSearch}
        onChange={(e) => setDesignNameSearch(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 20, fontSize: 16 }}
        aria-label="Search designs by name"
      />

      {/* Email Favorites Button */}
      <EmailFavoritesButton handbags={handbags} />

      {/* Display Results */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredHandbags.length === 0 && <p>No results found.</p>}

        {filteredHandbags.map((handbag) => (
          <li
            key={handbag.id}
            style={{
              marginBottom: 30,
              padding: 15,
              border: "1px solid #ccc",
              borderRadius: 6,
              backgroundColor: "#fafafa",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              <h3 style={{ margin: 0 }}>{handbag.name}</h3>
              <div>
                <em>{handbag.range || "N/A"}</em> | <span>{handbag.season || "N/A"}</span> |  <span>{handbag.releaseDate || "N/A"}</span>
              </div>
            </div>

            {/* Designs List */}
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {(handbag.variations?.design || [])
                .filter((design) =>
                  designNameSearch.trim()
                    ? typeof design.name === "string" &&
                      design.name.toLowerCase().includes(designNameSearch.trim().toLowerCase())
                    : true
                )
                .map((design) => (
                  <li
                    key={design.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDesignFavourite(handbag.id, design.name)}
                      aria-label={
                        design.favourite ? "Unfavourite design" : "Favourite design"
                      }
                      title={
                        design.favourite ? "Unfavourite design" : "Favourite design"
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 22,
                        color: design.favourite ? "gold" : "#ccc",
                        userSelect: "none",
                        padding: 0,
                      }}
                    >
                      {design.favourite ? "★" : "☆"}
                    </button>

                    {design.imageUrl && (
                      <img
                        src={design.imageUrl}
                        alt={design.name}
                        style={{
                          width: 120,
                          
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    )}

                    <div>
                      <strong>{design.name || "Unnamed Design"}</strong>
                      <div>
                        Category: {design.category || "N/A"} | Price: £{design.price ?? "0.00"}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HandbagSearch;
