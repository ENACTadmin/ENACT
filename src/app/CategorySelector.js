import React, { useState, useEffect } from "react";
import useDebounce from "./hooks/useDebounce";

function CategorySelector({
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm
}) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(inputValue, 200); // Debounce the input by 500ms

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  // Define categories directly
  const categories = {
    "Types": ["Op-ed", "Research", "Tool", "Other"],
    "Years": ["2021", "2020", "2019", "2018", "2017", "2016", "2015"],
    "State": ["MA", "CA", "NY", "TX", "FL", "IL", "PA"],
    "Institutions": ["Brandeis", "Harvard", "MIT", "Stanford", "Yale", "Princeton", "Columbia"],
    "Topic(s)/Issue(s)": ["Health", "Education", "Environment", "Economy", "Social Justice", "Other"],
  };

  return (
    <div
      style={{
        width: "200px",
        height: "100%",
        maxHeight: "80vh",
        // backgroundColor: "whitesmoke",
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
        <details key={group}>
          <summary>{group}</summary>
          {items.map((categoryName, index) => (
            <label
              key={index}
              style={{
                display: "block",
                marginTop: "5px",
                listStyle: "none"
              }}
            >
              <input
                type="radio"
                name="category"
                value={categoryName}
                checked={selectedCategory === categoryName}
                onChange={() => setSelectedCategory(categoryName)}
                style={{ marginRight: "5px" }}
              />
              {categoryName}
            </label>
          ))}
        </details>
      ))}
    </div>
  );
}

export default CategorySelector;
