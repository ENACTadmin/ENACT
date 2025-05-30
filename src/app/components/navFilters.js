// NavFilters.js
import React, { useState } from "react";

export default function NavFilters({
  counts,
  activeFilters,
  onFilterChange,
  textFilter,
  onTextFilterChange,
  onClearFilters
}) {
  if (!counts || !counts.data) return null;
  const { contentTypes, mediaTypes, tags, states, institutions, years } =
    counts.data;

  // count how many filters are active
  const activeCount = Object.values(activeFilters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const [openGroup, setOpenGroup] = useState("");
  const toggleGroup = (group) =>
    setOpenGroup(openGroup === group ? null : group);

  const renderGroup = (label, key, items) => {
    const isOpen = openGroup === key;
    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          onClick={() => toggleGroup(key)}
          style={{
            marginBottom: "0.5rem",
            textTransform: "capitalize",
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
          {label}{" "}
          <span style={{ fontSize: "0.8em" }}>{isOpen ? "–" : "+"}</span>
        </h4>
        {isOpen && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map(({ type, count }) => {
              const isActive = activeFilters[key]?.includes(type);
              return (
                <li key={`${key}::${type}`} style={{ marginBottom: "0.25rem" }}>
                  <button
                    onClick={() => onFilterChange(key, type)}
                    style={{
                      background: isActive ? "#0053A4" : "#f0f0f0",
                      color: isActive ? "#fff" : "#333",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left"
                    }}>
                    {type || "(none)"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <nav
      style={{
        width: "250px",
        padding: "1rem",
        borderRight: "1px solid #ddd",
        boxSizing: "border-box"
      }}>
      {/* free‐text input */}
      <input
        type="text"
        placeholder="Search title & description…"
        value={textFilter}
        onChange={(e) => onTextFilterChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "0.5rem",
          boxSizing: "border-box",
          border: "1px solid #ccc",
          borderRadius: "4px"
        }}
      />

      {/* active filters summary + clear */}
      <div
        style={{
          marginBottom: "1.5rem",
          fontSize: "0.9rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <span>
          {activeCount} filter{activeCount !== 1 ? "s" : ""} selected
        </span>
        {activeCount > 0 && (
          <button
            onClick={onClearFilters}
            style={{
              background: "transparent",
              border: "none",
              color: "#0053A4",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.9rem"
            }}>
            Clear
          </button>
        )}
      </div>

      {renderGroup("Content Types", "contentTypes", contentTypes)}
      {renderGroup("Media Types", "mediaTypes", mediaTypes)}
      {renderGroup("Tags", "tags", tags)}
      {renderGroup("States", "states", states)}
      {renderGroup("Institutions", "institutions", institutions)}
      {renderGroup("Years", "years", years)}
    </nav>
  );
}
