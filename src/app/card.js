import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const Card = (props) => {
 
  return (
    <div style={{ border: "0.2rem solid whitesmoke", padding: "1.5rem", width:"100%" }}>
      <h1 style={{ fontSize: "1.4rem" }}>{props.title}</h1>
      <p>{props.description}</p>
      <hr style={{ boxShadow: "none" }}></hr>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          justifyContent: "space-between",
          marginTop: "1rem"
        }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "0.2rem" }}>
          <p>{props.year}</p>
          <p>{props.state}</p>
          <p>{props.type}</p>
          <p>{props.author}</p>
          <p>{props.institution}</p>
        </div>
        <a
          href={props.link}
          target="_blank"
          style={{ padding: "0.5rem", fontSize: "0.8rem" }}
          className="btn-primary">
          Open in new tab
        </a>
      </div>
    </div>
  );
};
export default Card;
{
  /* {props.tags.map((tag, index) => <p key={index}>{tag}</p>)} */
}
