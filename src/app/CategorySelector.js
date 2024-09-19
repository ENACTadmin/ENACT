import React, { useState, useEffect } from "react";
import useDebounce from "./hooks/useDebounce";

function CategorySelector({
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  hits,
  resetFilters
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
    // Types: ["Op-ed", "Research", "Tool", "Other"],
    Years: [
      2009,
      1830,
      2011,
      2013,
      2015,
      2017,
      2021,
      2012,
      2022,
      2023,
      2018,
      2014,
      2016,
      2010,
      2024,
      2019,
      2020,
      2004
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
      "Brandeis",
      "Delaware State University",
      "Bennington College",
      "Randolph Macon College",
      "Emory University",
      "FrameWorks Institute",
      "Penn State University",
      "Florida Agricultural and Mechanical University",
      "Florida Agricultural and Mechanical University ",
      "Francis Marion University",
      "Arkansans For Campus Safety",
      "University of Hawaii",
      "Indiana University–Purdue University Indianapolis",
      "UNH",
      "University of Maine",
      "Western Michigan University",
      "Hendrix University",
      "University of Montana",
      "Laramie County Community College",
      "University of Nevada, Reno",
      "Cleveland State University",
      "Douglas Gould & Co.",
      "Pennsylvania State University",
      "Augustana University",
      "University of New Hampshire at Manchester",
      "University of Louisville",
      "Example University",
      "Siena College",
      "Brandeis University",
      "Florida Agricultural & Mechanical University",
      "The University of Utah",
      "",
      "Indiana University - Purdue University Indianapolis ",
      "Providence College",
      "Hendrix College",
      "The University of Mississippi",
      "Penn State University ",
      "Penn State ",
      "Metropolitan State University",
      "Brandeis University ",
      "Drake University",
      "University of Hartford",
      "Rutgers University",
      "ENACT Institute",
      "United States Air Force Academy",
      "West Virginia University",
      "Rutgers University - Camden",
      "Randolph-Macon College",
      "University of Maryland",
      "St. Norbert College",
      "University of Maine "
    ]
  };

  function renderInput(group, items) {
    switch (group) {
      case "State":
      case "Years":
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
        return items.map((categoryName, index) => (
          <label
            key={index}
            style={{ display: "block", marginTop: "5px", listStyle: "none" }}>
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
      }}>
      <input
        type="search"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px", width: "100%" }}
      />

      <button onClick={resetFilters} style={{ padding: "10px" }}>
        Reset Filters
      </button>

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
