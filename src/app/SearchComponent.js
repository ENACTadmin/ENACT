import React, { useState } from "react";
import ReactDOM from "react-dom";
import NavFilters from "./components/navFilters";
import { useResourceCounts, useAllResources } from "./hooks/useData";
import Card from "./components/card";

function SearchComponent() {
  const {
    counts,
    loading: countsLoading,
    error: countsError
  } = useResourceCounts();
  const { items, loading: itemsLoading, error: itemsError } = useAllResources();

  // six facet‐groups
  const [activeFilters, setActiveFilters] = useState({
    contentTypes: [],
    mediaTypes: [],
    tags: [],
    states: [],
    institutions: [],
    years: []
  });

  // free‐text
  const [textFilter, setTextFilter] = useState("");

  const onFilterChange = (group, value) => {
    setActiveFilters((prev) => {
      const set = new Set(prev[group]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [group]: Array.from(set) };
    });
  };

  // apply text + all six facet‐groups
  const filteredItems = items
    .filter((it) => {
      if (!textFilter) return true;
      return `${it.name} ${it.description}`
        .toLowerCase()
        .includes(textFilter.toLowerCase());
    })
    .filter(
      (it) =>
        (activeFilters.contentTypes.length === 0 ||
          activeFilters.contentTypes.includes(it.contentType)) &&
        (activeFilters.mediaTypes.length === 0 ||
          activeFilters.mediaTypes.includes(it.mediaType)) &&
        (activeFilters.tags.length === 0 ||
          it.tags.some((t) => activeFilters.tags.includes(t))) &&
        (activeFilters.states.length === 0 ||
          activeFilters.states.includes(it.state)) &&
        (activeFilters.institutions.length === 0 ||
          activeFilters.institutions.includes(it.institution)) &&
        (activeFilters.years.length === 0 ||
          activeFilters.years.includes(it.yearOfCreation))
    );

  if (countsLoading || itemsLoading) {
    return <p>Loading…</p>;
  }
  if (countsError) return <p>Error loading counts: {countsError}</p>;
  if (itemsError) return <p>Error loading items: {itemsError}</p>;

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
                gridTemplateColumns: "repeat(auto-fill, minmax(1fr))",
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
