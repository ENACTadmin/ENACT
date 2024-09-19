import React, { useState, useEffect } from "react";
import useDebounce from "./hooks/useDebounce";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // This imports default styles for the slider

function StickySearchInput({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  hits,
  resetFilters
}) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(inputValue, 400); // Debounce the input by 250ms

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

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
            style={{
              marginBottom: "20px",
              padding: "5px 10px", // Adjust padding for better alignment of text
              width: "98%", // Make the dropdown slightly shorter in width
              fontSize: "0.8rem", // Smaller text size
              borderRadius: "15px", // Rounded corners
              height: "30px", // Shorter height for a more compact look
              outline: "none", // Remove focus outline
              border: "1px solid #ccc", // Subtle border styling
              backgroundColor: "#fff", // Ensure background color for consistency
              color: "#333", // Text color
              cursor: "pointer" // Cursor to pointer on hover
            }}>
            <option value="">Select {group}</option>{" "}
            {/* Default 'not selected' state */}
            {items.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        );
      case "To":
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
              None {/* Default 'not selected' radio option */}
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
        return null; // Default case for unexpected categories
    }
  }

  return (
    <div
      style={{
        position: "sticky", // Use sticky positioning
        top: 80, // Stick to the top when scrolling
        zIndex: 1000,
        backgroundColor: "white",
        padding: "0",
        width: "100%",
        marginBottom: "20px"
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          width: "100%",
          marginBottom: "20px"
        }}>
        <input
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search..."
          aria-label="Search" // ARIA label for accessibility
          style={{
            width: "100%",
            padding: "10px",
            paddingLeft: "40px", // Make space for the icon
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#ccc",
            pointerEvents: "none" // Make the icon non-interactive
          }}
          aria-hidden="true" // Hide the icon from screen readers as it's decorative
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </div>
      </div>

      {/* Display selected categories */}
      <div
        style={{
          marginTop: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap", // Enable wrapping
          gap: "1rem",
          padding: "1rem",
          listStyle: "none"
          // border: "0.1px solid lightgrey" // Uncomment if border is needed
        }}>
        {/* Conditionally render the reset button if any filters are selected */}

        {Object.entries(categories).map(([group, items]) => (
          <div
            key={group}
            style={{
              flex: "1",
              minWidth: "120px", // Minimum width before wrapping
              marginRight: "5px",
              width: "100%" // This will take as much width as possible before wrapping
            }}>
            {renderInput(group, items)}
          </div>
        ))}
      </div>

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
    </div>
  );
}

export default StickySearchInput;
