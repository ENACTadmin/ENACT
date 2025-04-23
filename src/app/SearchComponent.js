import React, { useState } from "react";
import ReactDOM from "react-dom";
import NavFilters from "./components/navFilters";
import { useResourceCounts, useAllResources } from "./hooks/useData";
import Card from "./components/card";

// main cards skeleton
const LoadingSkeleton = ({ count }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(1fr))",
      gap: "1rem",
      width: "100%"
    }}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          border: "1px solid #eee",
          padding: "1rem",
          borderRadius: "4px",
          background: "#f9f9f9"
        }}>
        <div
          style={{
            background: "#ddd",
            height: 20,
            width: "60%",
            marginBottom: 12
          }}
        />
        <div
          style={{
            background: "#ddd",
            height: 16,
            width: "80%",
            marginBottom: 20
          }}
        />
        <div style={{ background: "#ddd", height: 100, width: "100%" }} />
      </div>
    ))}
  </div>
);

// nav filters skeleton
const NavSkeleton = () => (
  <nav
    style={{
      width: 250,
      padding: "1rem",
      borderRight: "1px solid #ddd",
      boxSizing: "border-box"
    }}>
    <div
      style={{
        background: "#ddd",
        height: 32,
        marginBottom: "1.5rem",
        borderRadius: 4
      }}
    />
    {Array.from({ length: 4 }).map((_, gi) => (
      <div key={gi} style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            background: "#ddd",
            height: 16,
            width: "50%",
            marginBottom: 8,
            borderRadius: 2
          }}
        />
        {Array.from({ length: 3 }).map((_, li) => (
          <div
            key={li}
            style={{
              background: "#eee",
              height: 14,
              width: `${80 - li * 10}%`,
              marginBottom: 6,
              borderRadius: 2
            }}
          />
        ))}
      </div>
    ))}
  </nav>
);

function SearchComponent() {
  const {
    counts,
    loading: countsLoading,
    error: countsError
  } = useResourceCounts();
  const { items, loading: itemsLoading, error: itemsError } = useAllResources();

  const [activeFilters, setActiveFilters] = useState({
    contentTypes: [],
    mediaTypes: [],
    tags: [],
    states: [],
    institutions: [],
    years: []
  });
  const [textFilter, setTextFilter] = useState("");

  const onFilterChange = (group, value) => {
    setActiveFilters((prev) => {
      const s = new Set(prev[group]);
      s.has(value) ? s.delete(value) : s.add(value);
      return { ...prev, [group]: Array.from(s) };
    });
  };
  const onClearFilters = () => {
    setActiveFilters({
      contentTypes: [],
      mediaTypes: [],
      tags: [],
      states: [],
      institutions: [],
      years: []
    });
    setTextFilter("");
  };

  const filteredItems = items
    .filter((it) =>
      !textFilter
        ? true
        : `${it.name} ${it.description}`
            .toLowerCase()
            .includes(textFilter.toLowerCase())
    )
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

  if (countsError) return <p>Error loading counts: {countsError}</p>;
  if (itemsError) return <p>Error loading items: {itemsError}</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        paddingBottom: 100
      }}>
      <div
        style={{
          display: "flex",
          maxWidth: 1200,
          width: "100%"
        }}>
        {/* lock in nav width with skeleton */}
        {countsLoading ? (
          <NavSkeleton />
        ) : (
          <NavFilters
            counts={counts}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            textFilter={textFilter}
            onTextFilterChange={setTextFilter}
            onClearFilters={onClearFilters}
          />
        )}

        <main
          style={{
            flex: 1,
            padding: "0 1rem",
            minHeight: 400
          }}>
          {/* cards area skeleton or real results */}
          {countsLoading || itemsLoading ? (
            <LoadingSkeleton count={8} />
          ) : filteredItems.length === 0 ? (
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
