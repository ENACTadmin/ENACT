import React, { useState, useEffect } from "react";
import Card from "../components/card";
import Skeleton from "react-loading-skeleton";
import { categories } from "../data/searchSetting";

const LoadingSkeleton = ({ count }) => (
  <div className="loading-container" style={{ maxWidth: "1000px" }}>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="loading-card"
        style={{
          marginBottom: "10px",
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px"
        }}>
        <Skeleton height={30} width="80%" />
        <Skeleton height={20} width="90%" style={{ marginTop: "10px" }} />
        <Skeleton height={60} width="100%" style={{ marginTop: "20px" }} />
      </div>
    ))}
  </div>
);

const Home = ({ onSelectTopic, showApiData = true }) => {
  const [apiData, setApiData] = useState([]);
  const [tags, setTags] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (showApiData) {
      const fetchData = async () => {
        try {
          const response = await fetch("/api/v0/resources/counts");
          const data = await response.json();
          setApiData(data.data.last);
          setContentTypes(data.data.contentTypes);
          setMediaTypes(data.data.mediaTypes);
          setTags(data.data.tags);
        } catch (error) {
          // console.error("Failed to fetch data from API:", error);
        } finally {
          setLoading(false); // Stop loading after fetch
        }
      };

      fetchData();
    } else {
      setLoading(false); // If `showApiData` is false, set loading to false immediately
    }
  }, [showApiData]);

  const allTopics = [...contentTypes, ...tags, ...mediaTypes];
  const filteredAllTopics = allTopics.filter(
    (item) =>
      item.type !== "" &&
      item.type !== "half-semester course" &&
      item.type != "full-semester course" &&
      item.type != "on"
  );
  const displayedTopics = showAll
    ? filteredAllTopics
    : contentTypes.slice(0, 7);

  return (
    <>
      {/* Render Topics Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center"
        }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(4, 1fr)`, // Dynamic columns
            gap: "1rem",
            justifyContent: "center",
            width: "100%",
            maxWidth: "1200px"
          }}>
          {displayedTopics.map((topic) => (
            <div
              style={{
                height: "30px",
                padding: "1px",
                borderRadius: "20px",
                border: "none",
                backgroundColor: "white",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "0.4px solid blue",
                textTransform: "capitalize"
              }}
              key={topic.type}
              onClick={() => onSelectTopic(topic.type)}>
              <p style={{ textAlign: "center" }}>
                {topic.type} {topic.count}
              </p>
            </div>
          ))}
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              style={{
                height: "30px",
                padding: "1px",
                borderRadius: "20px",
                border: "0.2px solid gray",
                backgroundColor: "rgb(25, 25, 25)",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "white"
              }}>
              Show More &#x25BC;
            </button>
          )}
        </div>
      </div>

      <br />

      {/* Render Cards Section */}
      {showApiData && (
        <div style={{ marginBottom: "10px" }}>
          {loading ? (
            <LoadingSkeleton count={10} /> // Render skeletons while loading
          ) : (
            apiData.map((item) => (
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
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Home;
