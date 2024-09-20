import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "./card";
import StickySearchInput from "./StickySearchInput";

function SearchComponent() {
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const recommendations = [
    "Op-Ed",
    "Elevator Pitch",
    "NY",
    "Brandeis University"
  ];

  function resetFilters() {
    setSelectedCategory({});
    setSearchTerm("");
    setItems(allItems);
  }

  // Refactor fetchData to check if searchTerm is empty
  const fetchData = async () => {
    try {
      setLoading(true);
      let response;

      if (!searchTerm) {
        response = await fetch("/api/v0/resources/all");
      } else {
        response = await fetch(
          `/api/v0/resources/searchByKeyword?searchString=${searchTerm}`
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure data is an array, or set an empty array if no results
      if (Array.isArray(data)) {
        setAllItems(data);
        setItems(data);
      } else {
        setAllItems([]);
        setItems([]);
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setAllItems([]); // Set items to empty array in case of an error
      setItems([]);
      setLoading(false);
    }
  };

  // Fetch data on initial render and when searchTerm changes
  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  useEffect(() => {
    let filteredItems = Array.isArray(allItems) ? allItems : [];

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
        case "contentTypes":
          filteredItems = filteredItems.filter(
            (item) =>
              item.contentType &&
              item.contentType.toLowerCase() ===
                selectedCategory[key].toLowerCase()
          );
          break;
        case "mediaTypes":
          filteredItems = filteredItems.filter(
            (item) =>
              item.mediaType &&
              item.mediaType.toLowerCase() ===
                selectedCategory[key].toLowerCase()
          );
          break;
        case "institutions":
          filteredItems = filteredItems.filter(
            (item) =>
              item.institution &&
              item.institution.toLowerCase() ===
                selectedCategory[key].toLowerCase()
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

    setItems(filteredItems); // Set filtered results
  }, [searchTerm, selectedCategory, allItems]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        paddingBottom: "100px"
      }}>
      <section
        style={{ display: "flex", flexDirection: "row", maxWidth: "1000px" }}>
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "900px"
          }}>
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
                gap: "20px"
              }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: "1000px",
                    height: "200px",
                    border: "2px solid #f0f0f0",
                    marginBottom: "20px",
                    borderRadius: "8px",
                    padding: "20px"
                  }}>
                  <Skeleton height={30} width="80%" />
                  <Skeleton
                    height={20}
                    width="90%"
                    style={{ marginTop: "10px" }}
                  />
                  <Skeleton
                    height={60}
                    width="100%"
                    style={{ marginTop: "20px" }}
                  />
                </div>
              ))}
            </div>
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
                alignItems: "center"
              }}>
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
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2rem",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center"
                    }}>
                    <p>
                      No items found matching your criteria. Why not try one of
                      these?
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px"
                      }}>
                      {recommendations.map((recommendation, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            resetFilters(); // Clear all filters
                            setSearchTerm(recommendation); // Set the new search term
                          }}
                          style={{
                            padding: "10px 20px",
                            borderRadius: "5px",
                            border: "none",
                            backgroundColor: "#f0f0f0",
                            cursor: "pointer"
                          }}>
                          {recommendation}
                        </button>
                      ))}
                    </div>
                    <svg
                      width="50%"
                      height="50%"
                      viewBox="0 0 48 59"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      {/* SVG content here */}
                    </svg>
                  </div>
                </div>
              )}
            </ul>
          )}
        </aside>
      </section>
    </div>
  );
}

ReactDOM.render(<SearchComponent />, document.getElementById("root"));
