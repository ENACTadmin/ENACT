import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import Card from "./card";
import StickySearchInput from "./StickySearchInput";

function SearchComponent() {
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  function resetFilters() {
    setSelectedCategory({});
    setSearchTerm("");
    setItems(allItems);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v0/resources/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllItems(data);
        setItems(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredItems = allItems;

    if (searchTerm) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    Object.keys(selectedCategory).forEach((key) => {
      if (filteredItems.length === 0) return; // Short-circuit if no items left to filter

      switch (key) {
        case "Topics":
          filteredItems = filteredItems.filter(
            (item) =>
              item.tags &&
              item.tags.some(
                (tag) =>
                  tag.toLowerCase() === selectedCategory[key].toLowerCase()
              )
          );
          break;
        case "Years":
          filteredItems = filteredItems.filter(
            (item) => `${item.yearOfCreation}` === selectedCategory[key]
          );
          break;
        case "State":
          filteredItems = filteredItems.filter(
            (item) =>
              item.state &&
              item.state.toLowerCase() === selectedCategory[key].toLowerCase()
          );
          break;
        default:
          if (key !== "Types") {
            filteredItems = filteredItems.filter(
              (item) =>
                item[key] &&
                item[key].toLowerCase() === selectedCategory[key].toLowerCase()
            );
          }
          break;
      }
    });

    setItems(filteredItems);
  }, [searchTerm, selectedCategory, allItems]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        paddingBottom: "100px",
      }}
    >
      <section
        style={{ display: "flex", flexDirection: "row", maxWidth: "1000px" }}
      >
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "900px",
          }}
        >
          <StickySearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            hits={items.length}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            resetFilters={resetFilters}
          />
          {error && <div>Error: {error}</div>}
          {loading ? (
                <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: "1000px",
                      height: "200px",
                      border: "2px solid #f0f0f0", // Light gray background for skeleton
                      marginBottom: "20px", // Space between skeletons
                      borderRadius: "8px", // Optional: if your cards have rounded corners
                      padding: "20px", // Padding inside the skeleton container
                    }}
                  >
                    <Skeleton height={30} width="80%" /> {/* Simulate a title bar */}
                    <Skeleton height={20} width="90%" style={{ marginTop: "10px" }} /> {/* Simulate a subtitle or additional info */}
                    <Skeleton height={60} width="100%" style={{ marginTop: "20px" }} /> {/* Simulate main content area */}
                  </div>
                ))}
              </div> // Use 3 skeleton loaders as placeholders
          ) : (
            <ul
              style={{
                width: "100%",
                listStyleType: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                padding: "0",
                margin: "0",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              {items.length > 0 ? (
                items.map((item) => (
                  <Card
                    key={item._id}
                    title={item.name}
                    description={item.description}
                    link={item.uri}
                    state={item.state}
                    type={item.mediaType}
                    year={item.yearOfCreation}
                    author={item.authorName}
                    tags={item.tags}
                    institution={item.institution}
                  />
                ))
              ) : (
                <li>No items found matching your criteria.</li>
              )}
            </ul>
          )}
        </aside>
      </section>
    </div>
  );
}

ReactDOM.render(<SearchComponent />, document.getElementById("root"));
