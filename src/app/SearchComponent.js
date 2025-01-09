import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "./components/card";
import Home from "./components/home";
import StickySearchInput from "./components/StickySearchInput";
import { categories } from "./data/searchSetting";
import SearchImage from "./media/Search.svg";

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
        console.log("Data fetched:", data);
        console.log("Data fetched:", data.length);
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
const filterItems = (items, selectedCategory) => {
  let filtered = items;

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
      case "contentTypes":
        filtered = filtered.filter(
          (item) =>
            item.contentType &&
            item.contentType.toLowerCase() === categoryFilter
        );
        break;
      case "mediaTypes":
        filtered = filtered.filter(
          (item) =>
            item.mediaType &&
            item.mediaType.toLowerCase() === categoryFilter
        );
        break;
      case "institutions":
        filtered = filtered.filter(
          (item) =>
            item.institution &&
            item.institution.toLowerCase() === categoryFilter
        );
        break;
        case "State":
          filtered = filtered.filter(
            (item) =>
              item.state &&
              item.state.toLowerCase() === categoryFilter
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
  const items = filterItems(allItems, selectedCategory);

  const resetFilters = () => {
    setSelectedCategory({});
    setSearchTerm("");
  };

  const handleSelectTopic = (topic) => {
    console.log("Selected topic:", topic);
    setSelectedCategory({});
    // Pass the topic to StickySearchInput by setting the searchTerm state
    setSearchTerm(topic);
  };

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
            searchTerm={searchTerm} // Pass the search term
            setSearchTerm={setSearchTerm} // Allow StickySearchInput to update the term
            hits={items.length}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            resetFilters={resetFilters}
          />
          {error && <ErrorDisplay error={error} />}
          {loading ? (
            <LoadingSkeleton count={5} />
          ) : isHome ? (
            <Home onSelectTopic={handleSelectTopic} />
          ) : hasSearchResults ? (
            <ul className="items-list" style={{ paddingLeft: 0 }}>
              {items.map((item) => (
                <Card
                  key={item._id}
                  id={item._id}
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
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                width: "100%",
                maxWidth: "1200px"
              }}>
              <img
                src={SearchImage}
                alt="Search Icon"
                style={{ height: "300px" }}
              />
              <p>
                No matches to your filters and search. Narrow your search of try
                one of the suggestions bellow
              </p>
              <Home onSelectTopic={handleSelectTopic} showApiData={false} />
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}

ReactDOM.render(<SearchComponent />, document.getElementById("root"));
