import React, { useState, useEffect } from "react";
import useDebounce from "./hooks/useDebounce";

function CategorySelector({
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  hits
}) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(inputValue, 250); // Debounce the input by 250ms

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  // useEffect(() => {
  //   console.log("Selected Category:", selectedCategory);
  // }, [selectedCategory]);

  // Define categories with appropriate input types
  const categories = {
    "Types": ["Op-ed", "Research", "Tool", "Other"],
    "Years": [2025, 2024, 2023, 2022, 2021, 2020],
    "State": ["MA", "CA", "NY", "TX", "FL", "IL", "PA"],
    "Topics": ["Health", "Education", "Environment", "Economy", "Social Justice", "Other"]
  };

  function renderInput(group, items) {
    switch (group) {
      case "State":
      case "Years": // Using dropdowns for "State" and "Years"
        return (
          <select
            value={selectedCategory[group] || ''}
            onChange={(e) => setSelectedCategory({ ...selectedCategory, [group]: e.target.value })}
            style={{ marginBottom: "20px", padding: "5px", width: "100%" }}
          >
            {items.map((item, index) => <option key={index} value={item}>{item}</option>)}
          </select>
        );
      case "Types":
      case "Topic(s)/Issue(s)": // Using radio buttons for "Types" and "Topic(s)/Issue(s)"
        return items.map((categoryName, index) => (
          <label key={index} style={{ display: "block", marginTop: "5px", listStyle: "none" }}>
            <input
              type="radio"
              name={group}
              value={categoryName}
              checked={selectedCategory[group] === categoryName}
              onChange={() => setSelectedCategory({ ...selectedCategory, [group]: categoryName })}
              style={{ marginRight: "5px" }}
            />
            {categoryName}
          </label>
        ));
      default:
        return null; // Default case for unexpected categories
    }
  }

  return (
    <div
      style={{
        width: "200px",
        height: "100%",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        listStyle: "none",
        position: "sticky",
        top: 100,
        zIndex: 1,
        overflowY: "auto",
        border: "0.1px solid lightgrey"
      }}
    >
      <input
        type="search"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px", width: "100%" }}
      />

      {Object.entries(categories).map(([group, items]) => (
        <details key={group} open>
          <summary>{group}</summary>
          {renderInput(group, items)}
        </details>
      ))}
    </div>
  );
}

export default CategorySelector;
