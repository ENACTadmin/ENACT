import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Card from "./card";
import CategorySelector from "./CategorySelector";
import Pagination from "./Pagination";

function SearchComponent() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]); // Dynamic categories from API
  const [categoriesWithAmount, setCategoriesWithAmount] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Initialize totalPages from API
  const [data, setData] = useState([]); // Initialize totalPages from API
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v0/resources/allstats");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.resources);
        let filteredItems = data.resources;
        
        // Only apply the filter if searchTerm is not empty and not undefined
        if (searchTerm) {
          filteredItems = data.resources.filter(item =>
            item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setItems(filteredItems);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [searchTerm]); // React to changes in searchTerm
  
  // console.log("stats", data.stats);
  console.log("resources", data.resources);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await fetch("/api/v0/resources/stats/");
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setCategories(data.totalPerTag.map((tag) => tag.tag)); // Assuming the response structure has a 'totalPerTag' field
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  useEffect(() => {
    const fetchCategoriesWithAmount = async () => {
      try {
        const response = await fetch("/api/v0/resources/stats/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategoriesWithAmount(
          data.totalPerTag.map((tag) => [tag.tag, tag.count])
        ); // Assuming the response structure has a 'totalPerTag' field
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategoriesWithAmount();
  }, []);

  // console.log(categoriesWithAmount);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const url = selectedCategory
  //         ? `/api/v0/resources/tags/${selectedCategory}?page=${currentPage}&limit=10`
  //         : `/api/v0/resources?page=${currentPage}&limit=10`;
  //       const response = await fetch(url);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       // setItems(data.data);
  //       // setTotalPages(data.totalPages || 0); // Assume 'totalPages' is the key, default to 1 if not provided
  //       setLoading(false);
  //     } catch (error) {
  //       setError(error.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [currentPage, selectedCategory]); // Dependency on currentPage and selectedCategory

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("/api/v0/resources/allstats");
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  
  //       // Filter the items ensuring the 'title' is defined and converting it to lower case
  //       const filteredItems = data.resources.filter(item =>
  //         item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //       setItems(filteredItems);
  //       setLoading(false);
  //     } catch (error) {
  //       setError(error.message);
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchData();
  // }, [searchTerm]); // React to changes in searchTerm
  
  if (loading && !error) return <div></div>;
  if (error) return <div>Error: {error}</div>;
  const sorted = categories.sort((a, b) =>
    a.toUpperCase().localeCompare(b.toUpperCase())
  );
  // console.log(sorted);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px"
      }}>
      <h1>{searchTerm}</h1>
      <section
        style={{ display: "flex", flexDirection: "row", maxWidth: "1000px" }}>
        <nav
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "100%"
          }}>
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange} // Pass the handler
          />
        </nav>
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "800px"
          }}>
          {/* <ul style={{ width: "100%", listStyleType: "none" }}>
            {items.map((item) => (
              
                <Card
                  key={item._id}
                  title={item.name}
                  description={item.description}
                  link={item.uri}
                  state={item.state}
                  type={item.resourceType}
                  year={item.yearOfCreation}
                  author={item.authorName}
                />
           
            ))}
          </ul> */}
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
              }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : (
            <ul
              style={{
                width: "100%",
                listStyleType: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem"
              }}>
              {items.map((item) => (
                <Card
                  key={item._id}
                  title={item.name}
                  description={item.description}
                  link={item.uri}
                  state={item.state}
                  type={item.mediaType}
                  year={item.yearOfCreation}
                  author={item.authorName}
                />
              ))}
            </ul>
          )}
          {/* <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          /> */}
        </aside>
      </section>
    </div>
  );
}

ReactDOM.render(<SearchComponent />, document.getElementById("root"));
