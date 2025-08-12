

// App.js
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AddHandbagButton from "./components/AddHandbagButton";
import HandbagsJsonViewer from "./components/HandbagsJsonViewer";
import Handbags from "./components/Handbags";           // your admin CRUD page
import HandbagSearch from "./components/HandbagSearch"; // the search/filter page you created

const App = () => {
  return (
    <div>
      {/* Simple navigation links */}
      <nav style={{ marginBottom: 20 }}>
        <Link to="/" style={{ marginRight: 15 }}>
          Admin - Handbags
        </Link>
         <Link to="/add"  style={{ marginRight: 15 }}>Add Handbags</Link>
        <Link to="/export"  style={{ marginRight: 15 }}>Export JSON Handbags</Link>
        <Link to="/search">Search Handbags</Link>
      </nav>

      {/* Define routes */}
      <Routes>
        <Route path="/" element={<Handbags />} />
            <Route path="/add" element={<AddHandbagButton />} />
             <Route path="/export" element={<HandbagsJsonViewer />} />
        <Route path="/search" element={<HandbagSearch />} />
        {/* Add more routes here as needed */}
      </Routes>
    </div>
  );
};

export default App;
