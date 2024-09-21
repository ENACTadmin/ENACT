import React from "react";
import { DocumentTextIcon, VideoCameraIcon, PresentationChartBarIcon, PhotoIcon } from "@heroicons/react/24/solid";

const Card = (props) => {

  const renderIcon = (type) => {
    switch (type.toLowerCase()) {
      case "document":
        return <DocumentTextIcon className="icon-class" style={{ width: "16px", height: "16px", fill:"white" }} />;
      case "video":
        return <VideoCameraIcon className="icon-class" style={{ width: "16px", height: "16px", fill:"white" }} />;
      case "powerpoint":
        return <PresentationChartBarIcon className="icon-class" style={{ width: "16px", height: "16px", fill:"white" }} />;
      case "photo":
        return <PhotoIcon className="icon-class" style={{ width: "16px", height: "16px", fill:"white" }} />;
      default:
        return; 
    }
  };

  return (
    <div
      style={{
        border: "2px solid whitesmoke",
        padding: "1.5rem",
        width: "100%",
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
        <h1 style={{ fontSize: "1.4rem", margin: "0 0", padding: "0 0" }}>
          {props.title}
        </h1>
         <span style={{
            backgroundColor: "#0053A4",
            borderRadius: "50%", // Make it a circle
            width: "30px",       // Circle width
            height: "30px",      // Circle height
            display: "flex",     // Flexbox to center the icon
            alignItems: "center", // Center vertically
            justifyContent: "center", // Center horizontally
            color: "white"
         }}>
           {renderIcon(props.type)}
         </span> {/* Icon rendering */}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.2rem",
          margin: "0.2rem 0",
        }}>
        <h6>
          By: {props.author} at {props.institution} {props.state} {props.year}
        </h6>
      </div>
      <p>{props.description}</p>
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          justifyContent: "flex-start",
        }}>
        <a
          href={props.link}
          target="_blank"
          style={{ padding: "0.5rem", fontSize: "0.9rem" }}
          className="btn-primary">
          Open in new tab
        </a>
      </div>
    </div>
  );
};

export default Card;
