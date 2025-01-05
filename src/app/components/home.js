import React, { useState, useEffect } from "react";
import Card from "../components/card";
import Skeleton from "react-loading-skeleton";

const Topics = [
  "agriculture",
  "cannabis",
  "criminal justice",
  "disability",
  "energy",
  "environment",
  "higher education",
  "healthcare",
  "mental health",
  "opioids",
  "public health",
  "public safety",
  "race",
  "substance use and recovery",
  "taxes",
  "technology",
  "tourism",
  "transportation",
  "veterans",
  "violence and sexual assault",
  "voting",
  "women and gender",
  "COVID-19",
  "LGBTQ+",
  "labor",
  "housing and homelessness"
];

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

const Home = ({ onSelectTopic }) => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v0/resources/all?amount=10");
        const data = await response.json();
        setApiData(data); // Save the fetched data
      } catch (error) {
        // console.error("Failed to fetch data from API:", error);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchData();
  }, []);

  const displayedTopics = showAll ? Topics : Topics.slice(0, 11);

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
            gridTemplateColumns: `repeat(6, 1fr)`, // Dynamic columns
            gap: "1rem",
            justifyContent: "center",
            width: "100%",
            maxWidth: "1200px"
          }}>
          {displayedTopics.map((topic) => (
            <div
              style={{
                height: "45px",
                padding: "1px 3px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#f0f0f0",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              key={topic}
              onClick={() => onSelectTopic(topic)}>
              <p style={{ textAlign: "center" }}>{topic}</p>
            </div>
          ))}
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              style={{
                padding: "5px",
                borderRadius: "5px",
                border: "0.2px solid gray",
                backgroundColor: "white",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}>
              Show More &#x25BC;
            </button>
          )}
        </div>
      </div>

      <br />

      {/* Render Cards Section */}
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
    </>
  );
};

export default Home;
