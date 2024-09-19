import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Card from "./card";
import CategorySelector from "./CategorySelector";

function SearchComponent() {
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v0/resources/allstats");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllItems(data.resources);
        setItems(data.resources);
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
      filteredItems = filteredItems.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    Object.keys(selectedCategory).forEach(key => {
      if (key === "Topics") {
        filteredItems = filteredItems.filter(item =>
          item.tags && item.tags.some(tag => tag.toLowerCase() === selectedCategory[key].toLowerCase())
        );
      } else if (key === "Years") {
        filteredItems = filteredItems.filter(item =>
          `${item.yearOfCreation}` === selectedCategory[key]
        );
      } else if (key !== "Types") {
        filteredItems = filteredItems.filter(item =>
          item[key] && item[key].toLowerCase() === selectedCategory[key].toLowerCase()
        );
      }
    });

    setItems(filteredItems);
  }, [searchTerm, selectedCategory, allItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px"
      }}>
      <section
        style={{ display: "flex", flexDirection: "row", maxWidth: "1000px" }}>
        <nav
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "100%"
          }}>
          <CategorySelector
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            hits={items.length} 
          />
        </nav>
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "800px"
          }}>
          <ul
            style={{
              width: "100%",
              listStyleType: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem"
            }}>
            {items.length > 0 ? items.map(item => (
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
            )) : <li>No items found matching your criteria.</li>}
          </ul>
        </aside>
      </section>
    </div>
  );
}

ReactDOM.render(<SearchComponent />, document.getElementById("root"));
