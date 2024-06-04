import React, { useState } from "react";

function CategorySelector({
  categories, // categories is now an array of arrays with each element like [categoryName, count]
  selectedCategory,
  setSelectedCategory
}) {
  const [activeGroup, setActiveGroup] = useState("All"); // State to track the active group

  const groupCategories = () => {
    const groups = { All: [], "A-G": [], "H-M": [], "N-T": [], "U-Z": [] };
    categories.forEach(([categoryName, count]) => {
      const category = categoryName; // Keep category name separate for sorting into groups
      const regex = /\b(course|semester)\b/i;

      // Skip categories that match the regex pattern
      if (regex.test(categoryName)) {
        return; // Continue to the next iteration of the forEach loop
      }
      if (categoryName === "") {
        groups["All"].push([categoryName, count]); // Push as an array to maintain structure
      } else {
        const firstLetter = categoryName[0].toUpperCase();
        if ("A" <= firstLetter && firstLetter <= "G")
          groups["A-G"].push([categoryName, count]);
        else if ("H" <= firstLetter && firstLetter <= "M")
          groups["H-M"].push([categoryName, count]);
        else if ("N" <= firstLetter && firstLetter <= "T")
          groups["N-T"].push([categoryName, count]);
        else if ("U" <= firstLetter && firstLetter <= "Z")
          groups["U-Z"].push([categoryName, count]);
      }
    });

    // Sort each group by category name
    Object.keys(groups).forEach((group) => {
      groups[group].sort((a, b) => a[0].localeCompare(b[0]));
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
        listStyle: "none"
      }}>
      {Object.entries(groupedCategories).map(([group, items]) => (
        <details key={group}>
          <summary>{group}</summary>
          {items.map(
            (
              [categoryName, count],
              index // Destructure the array into categoryName and count
            ) => (
              <label
                key={index}
                style={{
                  display: "block",
                  marginTop: "5px",
                  listStyle: "none"
                }}>
                <input
                  type="radio"
                  name="category"
                  value={categoryName} // Use categoryName for the value
                  checked={selectedCategory === categoryName} // Compare categoryName for checked status
                  onChange={() => setSelectedCategory(categoryName)} // Update selectedCategory with categoryName
                  style={{ marginRight: "5px" }}
                />
                {`${categoryName} (${count})`}
              </label>
            )
          )}
        </details>
      ))}
    </div>
  );
}

export default CategorySelector;
