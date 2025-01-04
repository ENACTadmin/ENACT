import React from "react";
import { categories } from "../data/searchSetting";

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
  return (
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
        {Topics.map((topic) => (
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
    </div>
  );
};

export default Home;
