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
        <div>
            <ul>
                {items.map(item => (
                    <li key={item._id} style={{marginBottom:"20px"}}>
                        <strong>{item.name}</strong> ({item.state})
                        <br />
                        Tags: {item.tags.join(", ")}
                        <br />
                        Description: {item.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

ReactDOM.render(<SearchComponent />, document.getElementById('root'));

  
