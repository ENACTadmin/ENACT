import React, { useState } from "react";

function CategorySelector({
  categories,
  selectedCategory,
  setSelectedCategory
}) {
  const [activeGroup, setActiveGroup] = useState("All"); // State to track the active group

  const groupCategories = () => {
    const groups = { All: [], "A-G": [], "H-M": [], "N-T": [], "U-Z": [] };
    categories.forEach((category) => {
      if (category === "") {
        groups["All"].push("");
      } else {
        const firstLetter = category[0].toUpperCase();
        if ("A" <= firstLetter && firstLetter <= "G")
          groups["A-G"].push(category);
        else if ("H" <= firstLetter && firstLetter <= "M")
          groups["H-M"].push(category);
        else if ("N" <= firstLetter && firstLetter <= "T")
          groups["N-T"].push(category);
        else if ("U" <= firstLetter && firstLetter <= "Z")
          groups["U-Z"].push(category);
      }
    });
    return groups;
  };

  const groupedCategories = groupCategories();

  return (
    <div
      style={{
        width: "200px",
        minHeight: "40vh",
        backgroundColor: "whitesmoke",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        listStyleType: "none"
      }}>
      {Object.entries(groupedCategories).map(([group, items]) => (
        <details key={group}>
          <summary>{group}</summary>
          {items.map((category, index) => (
            <label
              key={index}
              style={{
                display: "block",
                marginTop: "5px",
                listStyleType: "none"
              }}>
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
                style={{ marginRight: "5px" }}
              />
              {category}
            </label>
          ))}
        </details>
      ))}
    </div>
  );
}

export default CategorySelector;
