import React, { useState, useEffect } from "react";
import Card from "../components/card";
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

const Home = ({ onSelectTopic }) => {
  const [apiData, setApiData] = useState([]);

  // Fetch data from the API on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v0/resources/all?amount=10");
        const data = await response.json();
        setApiData(data); // Save the fetched data
        console.log("Data fetched from API:", data);
        console.log("Data fetched from API:", apiData);
      } catch (error) {
        console.error("Failed to fetch data from API:", error);
      }
    };

    fetchData();
  }, []);

  const [showAll, setShowAll] = useState(false);
  const displayedTopics = showAll ? Topics : Topics.slice(0, 8);

  return (
    <>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center"
        }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            width: "100%",
            maxWidth: "1200px"
          }}>
          {displayedTopics.map((topic) => (
            <div
              style={{
                flex: "1 1 calc(25% - 1rem)",
                maxWidth: "calc(25% - 1rem)",
                padding: "1rem",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#f0f0f0",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
                alignContent: "center",
                justifyContent: "center"
              }}
              key={topic}
              onClick={() => onSelectTopic(topic)}>
              <p style={{ textAlign: "center" }}>{topic}</p>
            </div>
          ))}
        </div>
        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              border: "1px solid gray",
              backgroundColor: "white",
              cursor: "pointer"
            }}>
            Show More Topics
          </button>
        )}
      </div>
      <br />
      <div>
        {" "}
        {apiData.map((item) => (
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
      </div>
    </>
  );
};

export default Home;
