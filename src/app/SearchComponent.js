import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "./components/card";
import Home from "./components/home";
import StickySearchInput from "./StickySearchInput";
import { categories } from "./data/searchSetting";

const LoadingSkeleton = ({ count }) => (
  <div className="loading-container" style={{ maxWidth: "1000px" }}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="loading-card">
        <Skeleton height={30} width="80%" />
        <Skeleton height={20} width="90%" style={{ marginTop: "10px" }} />
        <Skeleton height={60} width="100%" style={{ marginTop: "20px" }} />
      </div>
    ))}
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="error-message">Error: {error}</div>
);

const Recommendations = ({ recommendations, onSelect }) => (
  <div
    className="recommendations"
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center"
    }}>
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
      }}>
      <p style={{ textAlign: "center" }}>No items found. Try one of these:</p>
    </div>
    <div
      className="recommendations-buttons"
      style={{ display: "flex", gap: "10px" }}>
      {recommendations.map((rec, index) => (
        <button
          key={index}
          onClick={() => onSelect(rec)}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#f0f0f0",
            cursor: "pointer"
          }}>
          {rec}
        </button>
      ))}
    </div>
  </div>
);

const useFetchData = (searchTerm, setError) => {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false); // Default to false to avoid showing loading state unnecessarily

  useEffect(() => {
    if (!searchTerm) {
      // If no search term, don't fetch and reset the state
      setAllItems([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = `/api/v0/resources/searchByKeyword?searchString=${searchTerm}`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAllItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, setError]);

  return { allItems, loading };
};

const filterItems = (items, searchTerm, selectedCategory) => {
  let filtered = items;

  if (searchTerm) {
    filtered = filtered.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  Object.keys(selectedCategory).forEach((key) => {
    if (!filtered.length) return;
    const categoryFilter = selectedCategory[key]?.toLowerCase();
    switch (key) {
      case "Topics":
        filtered = filtered.filter(
          (item) =>
            item.tags &&
            item.tags.some((tag) => tag.toLowerCase() === categoryFilter)
        );
        break;
      case "Years":
        filtered = filtered.filter(
          (item) => `${item.yearOfCreation}` === categoryFilter
        );
        break;
      default:
        filtered = filtered.filter(
          (item) => item[key] && item[key].toLowerCase() === categoryFilter
        );
        break;
    }
  });

  return filtered;
};

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({});
  const [error, setError] = useState(null);

  const { allItems, loading } = useFetchData(searchTerm, setError);
  const items = filterItems(allItems, searchTerm, selectedCategory);

  const resetFilters = () => {
    setSelectedCategory({});
    setSearchTerm("");
  };

  // Determine the state
  const isHome = !searchTerm; // No search term means home state
  const hasSearchResults = searchTerm && items.length > 0;
  const noSearchResults = searchTerm && items.length === 0;

  return (
    <div
      className="search-component"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        paddingBottom: "100px"
      }}>
      <section
        style={{ display: "flex", flexDirection: "row", maxWidth: "1000px" }}>
        <aside>
          <StickySearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            hits={items.length}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            resetFilters={resetFilters}
          />
          {error && <ErrorDisplay error={error} />}
          {loading ? (
            <LoadingSkeleton count={5} />
          ) : isHome ? (
            <Home />
          ) : hasSearchResults ? (
            <ul className="items-list" style={{ paddingLeft: 0 }}>
              {items.map((item) => (
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
              ))}
            </ul>
          ) : noSearchResults ? (
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}>
              <Recommendations
                recommendations={[
                  "Op-Ed",
                  "Elevator Speech",
                  "Letter to the Legislator",
                  "Brandeis University"
                ]}
                onSelect={(rec) => {
                  resetFilters();
                  setSearchTerm(rec);
                }}
              />
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}

ReactDOM.render(<SearchComponent />, document.getElementById("root"));
