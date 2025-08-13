

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
         Search - Handbags
        </Link>
         <Link to="/add"  style={{ marginRight: 15 }}>Add Handbags</Link>
        <Link to="/export"  style={{ marginRight: 15 }}>Export JSON Handbags</Link>
        <Link to="/update">Admin Update Handbags</Link>
      </nav>

      {/* Define routes */}
      <Routes>
        <Route path="/update" element={<Handbags />} />
            <Route path="/add" element={<AddHandbagButton />} />
             <Route path="/export" element={<HandbagsJsonViewer />} />
        <Route path="/" element={<HandbagSearch />} />
        {/* Add more routes here as needed */}
      </Routes>
    </div>
  );
};

export default App;
