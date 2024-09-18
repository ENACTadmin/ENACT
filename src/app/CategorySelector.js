import React from "react";

function CategorySelector({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm, // This prop is now received from the parent
  setSearchTerm // This prop is now received from the parent
}) {
  const groupCategories = () => {
    const groups = { "A-G": [], "H-M": [], "N-T": [], "U-Z": [] };
    categories.forEach(([categoryName, count]) => {
      const regex = /\b(course|semester)\b/i;

      // Skip categories that match the regex pattern
      if (regex.test(categoryName)) {
        return; // Continue to the next iteration of the forEach loop
      }

      const firstLetter = categoryName[0].toUpperCase();
      if ("A" <= firstLetter && firstLetter <= "G")
        groups["A-G"].push([categoryName, count]);
      else if ("H" <= firstLetter && firstLetter <= "M")
        groups["H-M"].push([categoryName, count]);
      else if ("N" <= firstLetter && firstLetter <= "T")
        groups["N-T"].push([categoryName, count]);
      else if ("U" <= firstLetter && firstLetter <= "Z")
        groups["U-Z"].push([categoryName, count]);
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
        height: "100%",
        maxHeight: "80vh",
        backgroundColor: "whitesmoke",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        listStyle: "none",
        position: "sticky",
        top: 100,
        zIndex: 1,
        overflowY: "auto"
      }}>
      <input
        type="search" // Change the type to "search" to get a clear button
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px", width: "100%" }}
      />

      {Object.entries(groupedCategories).map(([group, items]) => (
        <details key={group}>
          <summary>{group}</summary>
          {items.map(([categoryName, count], index) => (
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
                value={categoryName}
                checked={selectedCategory === categoryName}
                onChange={() => setSelectedCategory(categoryName)}
                style={{ marginRight: "5px" }}
              />
              {`${categoryName} (${count})`}
            </label>
          ))}
        </details>
      ))}
    </div>
  );
}

export default CategorySelector;
