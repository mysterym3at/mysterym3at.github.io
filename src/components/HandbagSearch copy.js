import React, { useEffect, useState } from "react";
import HandbagService from "../services/handbagService";

// Price range presets
const priceRanges = [
  { label: "Under £50", min: 0, max: 50 },
  { label: "£50 - £100", min: 50, max: 100 },
  { label: "£100 - £200", min: 100, max: 200 },
  { label: "£200+", min: 200, max: Infinity },
];

const HandbagSearch = () => {
  const [handbags, setHandbags] = useState([]);
  const [filteredHandbags, setFilteredHandbags] = useState([]);

  // Filters
  const [seasonFilter, setSeasonFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [designNameFilter, setDesignNameFilter] = useState("");
  const [designCategoryFilter, setDesignCategoryFilter] = useState("");
  const [designPriceRangeFilter, setDesignPriceRangeFilter] = useState(null);
  const [designFavoriteFilter, setDesignFavoriteFilter] = useState(false);

  // Fetch handbags on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await HandbagService.getAllHandbags();
        setHandbags(data);
        setFilteredHandbags(data);
      } catch (error) {
        console.error("Failed to fetch handbags", error);
      }
    }
    fetchData();
  }, []);

  // Unique seasons for filter buttons
  const seasons = React.useMemo(() => {
    return [...new Set(handbags.map((h) => h.season).filter(Boolean))];
  }, [handbags]);

  // Unique handbag types for bag style filter buttons
  const types = React.useMemo(() => {
    return [...new Set(handbags.map((h) => h.type).filter(Boolean))];
  }, [handbags]);

  // Unique design categories
  const designCategories = React.useMemo(() => {
    const categories = handbags.flatMap((h) =>
      (h.variations?.design || [])
        .map((d) => d.category)
        .filter((cat) => typeof cat === "string" && cat.trim() !== "")
    );
    return [...new Set(categories)];
  }, [handbags]);

  // Filtering logic
  useEffect(() => {
    let filtered = [...handbags];

    if (seasonFilter) {
      filtered = filtered.filter(
        (h) => typeof h.season === "string" &&
          h.season.toLowerCase() === seasonFilter.toLowerCase()
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(
        (h) => typeof h.type === "string" &&
          h.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    if (priceRangeFilter) {
      filtered = filtered.filter((h) => {
        const designs = h.variations?.design || [];
        return designs.some((d) => {
          const price = Number(d.price) || 0;
          return price >= priceRangeFilter.min && price < priceRangeFilter.max;
        });
      });
    }

    if (nameFilter.trim()) {
      const searchLower = nameFilter.trim().toLowerCase();
      filtered = filtered.filter(
        (h) => typeof h.name === "string" &&
          h.name.toLowerCase().includes(searchLower)
      );
    }

    if (designNameFilter.trim()) {
      const searchLower = designNameFilter.trim().toLowerCase();
      filtered = filtered.filter((h) => {
        const designs = h.variations?.design || [];
        return designs.some(
          (d) =>
            typeof d.name === "string" &&
            d.name.toLowerCase().includes(searchLower)
        );
      });
    }

    if (designCategoryFilter) {
      filtered = filtered.filter((h) => {
        const designs = h.variations?.design || [];
        return designs.some(
          (d) =>
            typeof d.category === "string" &&
            d.category.toLowerCase() === designCategoryFilter.toLowerCase()
        );
      });
    }

    if (designFavoriteFilter) {
      filtered = filtered.filter((h) => {
        const designs = h.variations?.design || [];
        return designs.some((d) => d.favorite === true);
      });
    }

    if (designPriceRangeFilter) {
      filtered = filtered.filter((h) => {
        const designs = h.variations?.design || [];
        return designs.some((d) => {
          const price = Number(d.price) || 0;
          return (
            price >= designPriceRangeFilter.min &&
            price < designPriceRangeFilter.max
          );
        });
      });
    }

    setFilteredHandbags(filtered);
  }, [
    handbags,
    seasonFilter,
    typeFilter,
    priceRangeFilter,
    nameFilter,
    designNameFilter,
    designCategoryFilter,
    designPriceRangeFilter,
    designFavoriteFilter,
  ]);

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Search and Filter Handbags</h2>

      {/* Bag Type (Handbag type) Filter Buttons */}
      <div style={{ marginBottom: 20 }}>
        <strong>Bag Style: </strong>
        <button
          onClick={() => setTypeFilter("")}
          disabled={typeFilter === ""}
          style={{ marginRight: 8, padding: "6px 12px", cursor: "pointer" }}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            disabled={typeFilter.toLowerCase() === type.toLowerCase()}
            style={{ marginRight: 8, padding: "6px 12px", cursor: "pointer" }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Other filters (optional, can be added similarly) */}
      {/* ... insert other filters like season, price range, name search ... */}

      {/* Search by Handbag Name */}
      <input
        type="text"
        placeholder="Search handbags by name..."
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 20, fontSize: 16 }}
      />

      {/* Search by Design Name */}
      <input
        type="text"
        placeholder="Search designs by name..."
        value={designNameFilter}
        onChange={(e) => setDesignNameFilter(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 20, fontSize: 16 }}
      />

      {/* Additional filters like design category, favorite, price range can be added here */}

      {/* Filtered Handbags List */}
      <h3>Results ({filteredHandbags.length})</h3>
      {filteredHandbags.length === 0 && <p>No handbags found.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredHandbags.map((h) => (
          <li key={h.id} style={{ marginBottom: 20, border: "1px solid #ccc", borderRadius: 6, padding: 15 }}>
            <strong style={{ fontSize: 18 }}>{h.name}</strong><br />
            <small>Season: {h.season || "N/A"} | Type: {h.type || "N/A"  }</small>
            <div style={{ marginTop: 10 }}>
              <strong>Designs:</strong>
              <ul style={{ marginTop: 5, paddingLeft: 20 }}>
                {(h.variations?.design || []).map((d, idx) => (
                  <li key={idx} style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Design image */}
                    {d.image ? (
                      <img
                        src={d.image}
                        alt={d.name || "Design Image"}
                        style={{ width: 80, objectFit: "cover", borderRadius: 4 }}
                      />
                    ) : (
                      <div style={{
                        width: 60,
                        height: 60,
                        backgroundColor: "#eee",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                        fontSize: 12,
                      }}>
                        No Image
                      </div>
                    )}

                    {/* Design info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: 16 }}>
                        {d.name || "Unnamed Design"}{" "}
                        {d.favorite && (
                          <span
                            title="Favorite"
                            style={{ color: "gold", fontSize: 18, lineHeight: 1, marginLeft: 6 }}
                          >
                            ★
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: "#555" }}>
                        Category: {d.category || "N/A"} | Price: £{d.price || "0.00"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HandbagSearch;
