import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "./card";
import StickySearchInput from "./StickySearchInput";

function SearchComponent() {
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const recommendations = [
    "Op-Ed",
    "Elevator Pitch",
    "NY",
    "Brandeis University"
  ];

  function resetFilters() {
    setSelectedCategory({});
    setSearchTerm("");
    setItems(allItems);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v0/resources/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllItems(data);
        setItems(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredItems = allItems;

    if (searchTerm) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    Object.keys(selectedCategory).forEach((key) => {
      if (filteredItems.length === 0) return; // Short-circuit if no items left to filter

      switch (key) {
        case "Topics":
          filteredItems = filteredItems.filter(
            (item) =>
              item.tags &&
              item.tags.some(
                (tag) =>
                  tag.toLowerCase() === selectedCategory[key].toLowerCase()
              )
          );
          break;
        case "Years":
          filteredItems = filteredItems.filter(
            (item) => `${item.yearOfCreation}` === selectedCategory[key]
          );
          break;
        case "State":
          filteredItems = filteredItems.filter(
            (item) =>
              item.state &&
              item.state.toLowerCase() === selectedCategory[key].toLowerCase()
          );
          break;
        default:
          if (key !== "Types") {
            filteredItems = filteredItems.filter(
              (item) =>
                item[key] &&
                item[key].toLowerCase() === selectedCategory[key].toLowerCase()
            );
          }
          break;
      }
    });

    setItems(filteredItems);
  }, [searchTerm, selectedCategory, allItems]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        paddingBottom: "100px"
      }}>
      <section
        style={{ display: "flex", flexDirection: "row", maxWidth: "1000px" }}>
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "900px"
          }}>
          <StickySearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            hits={items.length}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            resetFilters={resetFilters}
          />
          {error && <div>Error: {error}</div>}
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px"
              }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: "1000px",
                    height: "200px",
                    border: "2px solid #f0f0f0", // Light gray background for skeleton
                    marginBottom: "20px", // Space between skeletons
                    borderRadius: "8px", // Optional: if your cards have rounded corners
                    padding: "20px" // Padding inside the skeleton container
                  }}>
                  <Skeleton height={30} width="80%" />{" "}
                  {/* Simulate a title bar */}
                  <Skeleton
                    height={20}
                    width="90%"
                    style={{ marginTop: "10px" }}
                  />{" "}
                  {/* Simulate a subtitle or additional info */}
                  <Skeleton
                    height={60}
                    width="100%"
                    style={{ marginTop: "20px" }}
                  />{" "}
                  {/* Simulate main content area */}
                </div>
              ))}
            </div> // Use 3 skeleton loaders as placeholders
          ) : (
            <ul
              style={{
                width: "100%",
                listStyleType: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                padding: "0",
                margin: "0",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}>
              {items.length > 0 ? (
                items.map((item) => (
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
                ))
              ) : (
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2rem",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center"
                    }}>
                    <p>
                      No items found matching your criteria. Why not try one of
                      these?
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px"
                      }}>
                      {recommendations.map((recommendation, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchTerm(recommendation)}
                          style={{
                            padding: "10px 20px",
                            borderRadius: "5px",
                            border: "none",
                            backgroundColor: "#f0f0f0",
                            cursor: "pointer"
                          }}>
                          {recommendation}
                        </button>
                      ))}
                    </div>
                    <svg
                      width="50%"
                      height="50%"
                      viewBox="0 0 48 59"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_28_6)">
                        <path
                          d="M17.1238 9.92213L19.5838 12.7621C20.2838 13.5721 21.2138 14.0021 22.1738 14.0021C22.5538 14.0021 22.9438 13.9321 23.3238 13.7921C24.8138 13.2321 25.7838 11.7421 25.7838 9.99213V9.22213C26.3938 8.67213 26.7838 7.88213 26.7838 7.00213C26.7838 6.12213 26.3938 5.33213 25.7838 4.78213V4.01213C25.7838 2.26213 24.8238 0.762128 23.3238 0.212128C21.9938 -0.287872 20.5638 0.112128 19.5838 1.24213L17.1238 4.08213C15.7838 4.38213 14.7738 5.57213 14.7738 7.00213C14.7738 8.43213 15.7838 9.62213 17.1238 9.92213ZM24.7738 7.00213C24.7738 7.55213 24.3238 8.00213 23.7738 8.00213H17.7738C17.2238 8.00213 16.7738 7.55213 16.7738 7.00213C16.7738 6.45213 17.2238 6.00213 17.7738 6.00213H23.7738C24.3238 6.00213 24.7738 6.45213 24.7738 7.00213ZM22.6138 11.9221C22.2938 12.0421 21.6738 12.1421 21.0838 11.4621L19.8238 10.0021H23.7638C23.7638 11.1021 23.1438 11.7221 22.6038 11.9221H22.6138ZM21.0838 2.55213C21.6638 1.87213 22.2938 1.97213 22.6138 2.09213C23.1438 2.29213 23.7638 2.91213 23.7738 4.01213H19.8338L21.0938 2.55213H21.0838ZM46.7738 28.0021V22.0221C46.7738 20.9221 45.8738 20.0221 44.7738 20.0221H16.3438L13.9338 16.0121C13.5738 15.3921 12.9338 15.0221 12.2038 15.0221H2.77379C1.67379 15.0221 0.77379 15.9221 0.77379 17.0221V28.0021C0.20379 28.6321 -0.0662102 29.4821 0.0137898 30.3221L2.60379 55.3221C2.76379 56.8521 4.04379 58.0121 5.58379 58.0121H41.9738C43.5138 58.0121 44.8038 56.8521 44.9538 55.3221L47.5438 30.3221C47.6338 29.4821 47.3538 28.6321 46.7838 28.0021H46.7738ZM2.77379 17.0021H12.2038L14.6138 21.0121C14.9738 21.6321 15.6138 22.0021 16.3438 22.0021H44.7738V27.0221C44.7038 27.0221 44.6338 27.0021 44.5538 27.0021H2.99379C2.92379 27.0021 2.85379 27.0221 2.77379 27.0221V17.0021ZM42.9638 55.1021C42.9138 55.6121 42.4838 56.0021 41.9738 56.0021H5.57379C5.06379 56.0021 4.63379 55.6121 4.58379 55.1021L1.99379 30.1021C1.96379 29.8121 2.05379 29.5421 2.24379 29.3321C2.43379 29.1221 2.70379 29.0021 2.98379 29.0021H44.5438C44.8338 29.0021 45.0938 29.1221 45.2838 29.3321C45.4738 29.5421 45.5638 29.8221 45.5338 30.1021L42.9438 55.1021H42.9638ZM16.7738 47.0021C16.7738 47.5521 16.3238 48.0021 15.7738 48.0021H9.00379C8.45379 48.0021 8.00379 47.5521 8.00379 47.0021C8.00379 46.4521 8.45379 46.0021 9.00379 46.0021H15.7738C16.3238 46.0021 16.7738 46.4521 16.7738 47.0021ZM13.5238 51.0021C13.5238 51.5521 13.0738 52.0021 12.5238 52.0021H9.01379C8.46379 52.0021 8.01379 51.5521 8.01379 51.0021C8.01379 50.4521 8.46379 50.0021 9.01379 50.0021H12.5238C13.0738 50.0021 13.5238 50.4521 13.5238 51.0021ZM29.6438 7.00213C29.6438 6.45213 30.0938 6.00213 30.6438 6.00213H31.1438C31.6938 6.00213 32.1438 6.45213 32.1438 7.00213C32.1438 7.55213 31.6938 8.00213 31.1438 8.00213H30.6438C30.0938 8.00213 29.6438 7.55213 29.6438 7.00213ZM39.4338 6.89213C39.5238 6.34213 40.0338 5.97213 40.5838 6.07213C41.0138 6.14213 41.4238 6.26213 41.8138 6.44213C42.3138 6.67213 42.5438 7.26213 42.3138 7.76213C42.1438 8.13213 41.7838 8.35213 41.4038 8.35213C41.2638 8.35213 41.1238 8.32213 40.9938 8.26213C40.7638 8.16213 40.5138 8.08213 40.2538 8.04213C39.7138 7.95213 39.3438 7.44213 39.4338 6.89213ZM39.3738 15.1221C39.2938 14.5721 39.6638 14.0721 40.2138 13.9821C40.4638 13.9421 40.7138 13.8721 40.9538 13.7721C41.4638 13.5521 42.0538 13.7821 42.2738 14.2921C42.4938 14.8021 42.2638 15.3921 41.7538 15.6121C41.3538 15.7821 40.9438 15.9021 40.5138 15.9721C40.4638 15.9721 40.4138 15.9821 40.3638 15.9821C39.8738 15.9821 39.4538 15.6221 39.3738 15.1321V15.1221ZM42.7438 11.4221C42.7638 11.2921 42.7738 11.1521 42.7738 11.0121C42.7738 10.8921 42.7738 10.7621 42.7538 10.6521C42.6838 10.1021 43.0738 9.60213 43.6238 9.54213C44.1838 9.46213 44.6738 9.86213 44.7338 10.4121C44.7538 10.6121 44.7738 10.8121 44.7738 11.0221C44.7738 11.2521 44.7538 11.4721 44.7338 11.6921C44.6638 12.1921 44.2338 12.5621 43.7438 12.5621C43.7038 12.5621 43.6538 12.5621 43.6138 12.5621C43.0638 12.4921 42.6838 11.9921 42.7538 11.4421L42.7438 11.4221ZM32.6838 17.3121C33.1338 17.6421 33.2238 18.2621 32.9038 18.7121C32.7338 18.9521 32.5738 19.2021 32.4338 19.4621C32.2538 19.8021 31.9038 19.9921 31.5538 19.9921C31.3938 19.9921 31.2338 19.9521 31.0838 19.8721C30.5938 19.6121 30.4138 19.0021 30.6738 18.5221C30.8538 18.1821 31.0638 17.8521 31.2938 17.5321C31.6238 17.0821 32.2438 16.9921 32.6938 17.3121H32.6838ZM37.2338 15.0121C37.3738 15.5421 37.0538 16.0921 36.5238 16.2321C36.2338 16.3121 35.9538 16.4021 35.6738 16.5221C35.5538 16.5721 35.4238 16.6021 35.2938 16.6021C34.9038 16.6021 34.5238 16.3721 34.3738 15.9821C34.1638 15.4721 34.4038 14.8821 34.9138 14.6721C35.2738 14.5221 35.6438 14.4021 36.0138 14.3021C36.5438 14.1621 37.0938 14.4821 37.2338 15.0121ZM34.2738 7.00213C34.2738 6.45213 34.7238 6.00213 35.2738 6.00213H36.3038C36.8538 6.00213 37.3038 6.45213 37.3038 7.00213C37.3038 7.55213 36.8538 8.00213 36.3038 8.00213H35.2738C34.7238 8.00213 34.2738 7.55213 34.2738 7.00213ZM30.6538 22.0021C31.2038 22.0021 31.6538 22.4521 31.6538 23.0021V23.5021C31.6538 24.0521 31.2038 24.5021 30.6538 24.5021C30.1038 24.5021 29.6538 24.0521 29.6538 23.5021V23.0021C29.6538 22.4521 30.1038 22.0021 30.6538 22.0021Z"
                          fill="#0053A4"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_28_6">
                          <rect width="48" height="59" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              )}
            </ul>
          )}
        </aside>
      </section>
    </div>
  );
}

ReactDOM.render(<SearchComponent />, document.getElementById("root"));
