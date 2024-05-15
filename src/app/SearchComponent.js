// import React from 'react';
// import ReactDOM from 'react-dom';
// function SearchComponent() {
//     return <h1>HYOYOYO from React</h1>;
//   }
  
//   ReactDOM.render(<SearchComponent />, document.getElementById('root'));



import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function SearchComponent() {
    // State to store the API data
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Healthcare', 'Education', 'Environment', 'Technology', 'Food', 'Finance'];


    useEffect(() => {
        // Function to fetch data from API
        const fetchData = async () => {
            try {
                const response = await fetch('/api/v0/resources/tags/healthcare?page=1&limit=20');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setItems(data.data); // Assuming the response has a data field
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center",alignItems:"center", gap:"2rem"}}>
            <input style={{width:"500px"}} type="text" placeholder="Search..." />
           <section style={{display:"flex",flexDirection:"row", gap:"10px"}}>
            <nav style={{padding:"1rem", display:"flex", gap:"20px", width:"250px", border:"1px solid gray", height:"100%"}}>
               <ul>
               {categories.map((category, index) => (
        <li key={index}>
          <label>
            <input
              type="radio"
              value={category}
              checked={selectedCategory === category}
            />
            {category}
          </label>
        </li>
      ))}

               </ul>
                </nav>
           <ul style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(100%, 1fr))",
      gap: "10px",
      padding: "10px",
      listStyleType: "none",
      maxWidth: "1000px",
      minWidth: "300px",
    }}>
                {items.map(item => (
                    <li key={item._id} style={{marginBottom:"20px"}}>
                        <strong style={{fontSize:"1.4rem",marginBottom:"20px"}}>{item.name}</strong> ({item.state})
                        <br />
                       <strong> Description:</strong> 
                       <br /> 
                       {item.description}
                   
                        <br />
                        <strong> Tags:</strong>  <br /> {item.tags.join(", ")}
                    </li>
                ))}
            </ul>
           </section>
        </div>
    );
}

ReactDOM.render(<SearchComponent />, document.getElementById('root'));

  
