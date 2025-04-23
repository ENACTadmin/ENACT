import React, { useState } from "react";
import ReactDOM from "react-dom";
import NavFilters from "./components/navFilters";
import { useResourceCounts, useAllResources } from "./hooks/useData";
import Card from "./components/card";
// import LoadingSkeleton from "./components/LoadingSkeleton";

function SearchComponent() {
  const {
    counts,
    loading: countsLoading,
    error: countsError
  } = useResourceCounts();
  const { items, loading: itemsLoading, error: itemsError } = useAllResources();

  // which group‐filters are active?
  const [activeFilters, setActiveFilters] = useState({
    contentTypes: [],
    mediaTypes: [],
    tags: []
  });

  // free‐text filter
  const [textFilter, setTextFilter] = useState("");

  const onFilterChange = (group, type) => {
    setActiveFilters((prev) => {
      const set = new Set(prev[group]);
      if (set.has(type)) set.delete(type);
      else set.add(type);
      return { ...prev, [group]: Array.from(set) };
    });
  };

  // apply both text + group filters
  const filteredItems = items
    .filter((it) =>
      textFilter
        ? (it.name + " " + it.description)
            .toLowerCase()
            .includes(textFilter.toLowerCase())
        : true
    )
    .filter(
      (it) =>
        (activeFilters.contentTypes.length === 0 ||
          activeFilters.contentTypes.includes(it.contentType)) &&
        (activeFilters.mediaTypes.length === 0 ||
          activeFilters.mediaTypes.includes(it.mediaType)) &&
        (activeFilters.tags.length === 0 ||
          it.tags.some((t) => activeFilters.tags.includes(t)))
    );

  // if (countsLoading || itemsLoading) return <LoadingSkeleton count={5} />;
  // if (countsError) return <div>Error loading counts: {countsError}</div>;
  // if (itemsError) return <div>Error loading items: {itemsError}</div>;

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
      <div
        className="search-component"
        style={{
          display: "flex",
          flexDirection: "row",
          maxWidth: "1200px",

          width: "100%"
        }}>
        <NavFilters
          counts={counts}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          textFilter={textFilter}
          onTextFilterChange={setTextFilter}
        />
        <main style={{ flex: 1, padding: "0 1rem", overflowY: "auto" }}>
          {filteredItems.length === 0 ? (
            <p>No resources match your filters.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax( 1fr))",
                gap: "1rem"
              }}>
              {filteredItems.map((item) => (
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

ReactDOM.render(<SearchComponent />, document.getElementById("root"));
