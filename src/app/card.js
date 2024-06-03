import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const Card = (props) => {
  return (
    <div style={{border: "0.1rem solid whitesmoke", padding:"0.5rem"}}>
      <h1 style={{fontSize:"1.4rem"}}>{props.title}</h1>
      <p>{props.description}</p>
      <p>{props.state}</p>
      <p>{props.type}</p>
      <p>{props.year}</p>
      {/* <p>{props.author}</p> */}
      <a href={props.link} target="_blank">Download</a>
    </div>
  );
};
export default Card;
