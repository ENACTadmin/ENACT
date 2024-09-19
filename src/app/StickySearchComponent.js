import React, { useState, useEffect, useRef } from "react";
import useDebounce from "./hooks/useDebounce";

function StickySearchComponent({
  selectedCategory,
  setSelectedCategory,
  hits,
  resetFilters
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(inputValue, 250); // Debounce the input by 250ms
  const [isSticky, setIsSticky] = useState(false);
  const inputRef = useRef(null);

  const categories = {
    Years: [
      2009, 1830, 2011, 2013, 2015, 2017, 2021, 2012, 2022, 2023, 2018, 2014,
      2016, 2010, 2024, 2019, 2020, 2004
    ],
    State: ["MA", "CA", "NY", "TX", "FL", "IL", "PA"],
    Topics: [
      "Health",
      "Education",
      "Environment",
      "Economy",
      "Social Justice",
      "Other"
    ],
    contentTypes: [
      "Next Steps",
      "Personal Reflection",
      "Online",
      "Flyer",
      "Course Planning",
      "ENACT Research",
      "Elevator Speech",
      "Op-Ed",
      "Assignment Guidelines",
      "Advocacy Video",
      "Student Advice",
      "Journal",
      "Letter to Legislator",
      "Research Report",
      "Portfolio",
      "empty",
      "News and Articles",
      "Syllabus",
      "Presentations",
      "Script"
    ],
    mediaTypes: ["video", "document", "photo", "PowerPoint", "empty"],
    institutions: [
      "Arts & Democracy Project",
      "The University of Maine",
      "Boise State University",
      "Randolph-macon",
      "The Pennsylvania State University",
      "University of New Hampshire",
      "Seattle University",
      "Brandeis University",
      "Delaware State University",
      "Bennington College",
      "Randolph Macon College",
      "Emory University",
      "FrameWorks Institute",
      "Penn State University",
      "Florida Agricultural and Mechanical University"
    ]
  };

  // Calculate the number of selected filters
  const selectedFilterCount = Object.values(selectedCategory).filter(
    (value) => value
  ).length;

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const inputTop =
      inputRef.current.getBoundingClientRect().top + window.scrollY;

    // Check if the scroll has passed the input and make it sticky
    if (scrollTop >= inputTop) {
      setIsSticky(true);
    }
    // If the scroll is above the input position, unstick
    else if (scrollTop < inputTop) {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  function renderInput(group, items) {
    switch (group) {
      case "State":
      case "Years":
      case "Topics":
      case "contentTypes":
      case "mediaTypes":
      case "institutions":
        // Using dropdowns for "State" and "Years"
        return (
          <select
            value={selectedCategory[group] || ""}
            onChange={(e) =>
              setSelectedCategory({
                ...selectedCategory,
                [group]: e.target.value
              })
            }
            style={{ marginBottom: "20px", padding: "5px", width: "100%" }}>
            <option value="">Select {group}</option>
            {items.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        );
      case "Topics":
      case "contentTypes":
      case "mediaTypes":
        // Using radio buttons for "Topics", "contentTypes", and "mediaTypes"
        return (
          <>
            <label
              style={{ display: "block", marginTop: "5px", listStyle: "none" }}>
              <input
                type="radio"
                name={group}
                value=""
                checked={!selectedCategory[group]}
                onChange={() =>
                  setSelectedCategory({
                    ...selectedCategory,
                    [group]: ""
                  })
                }
                style={{ marginRight: "5px" }}
              />
              None
            </label>
            {items.map((categoryName, index) => (
              <label
                key={index}
                style={{
                  display: "block",
                  marginTop: "5px",
                  listStyle: "none"
                }}>
                <input
                  type="radio"
                  name={group}
                  value={categoryName}
                  checked={selectedCategory[group] === categoryName}
                  onChange={() =>
                    setSelectedCategory({
                      ...selectedCategory,
                      [group]: categoryName
                    })
                  }
                  style={{ marginRight: "5px" }}
                />
                {categoryName}
              </label>
            ))}
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      {/* Sticky search input */}
      <div
        ref={inputRef}
        style={{
          position: isSticky ? "fixed" : "relative",
          top: isSticky ? 0 : "auto",
          zIndex: 1000,
          backgroundColor: "white",
          width: "100%",
          padding: "10px",
          boxShadow: isSticky ? "0 2px 5px rgba(0,0,0,0.3)" : "none",
          transition: "box-shadow 0.3s ease-in-out"
        }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search..."
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
        <div style={{ padding: "2px 10px 10px 10px" }}>
          {hits} documents found for "{searchTerm}"
        </div>
      </div>

      {/* Category Selector */}
      <div
        style={{
          marginTop: "80px", // To ensure it's spaced well below the sticky header
          width: "100%", // Make sure the container takes full width to fit row layout
          height: "100%",
          display: "flex", // Use flexbox to align items in a row
          flexDirection: "row", // Make sure the direction is row
          gap: "1rem", // Space between each item
          padding: "1rem",
          listStyle: "none",
          border: "1px solid red" // For debugging, remove after testing
        }}>
        {/* Conditionally render the reset button if any filters are selected */}
        {selectedFilterCount > 0 && (
          <button
            onClick={resetFilters}
            style={{
              borderRadius: "10px",
              border: "0.5px solid whitesmoke",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              color: "white",
              backgroundColor: "#0053A4"
            }}>
            <span
              style={{
                backgroundColor: "#3584d2",
                borderRadius: "12px",
                padding: "1px 5px",
                fontSize: "0.7rem"
              }}>
              {selectedFilterCount}
            </span>
            Clear Filters
            <span style={{ color: "white !important", fontWeight: "bold" }}>
              ✖
            </span>
          </button>
        )}

        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          {Object.entries(categories).map(([group, items]) => (
            <div
              key={group}
              style={{
                width: "150px", // Adjust width to fit in a row, or use percentage
                marginRight: "10px" // Adjust the spacing between elements
              }}>
              {renderInput(group, items)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StickySearchComponent;
