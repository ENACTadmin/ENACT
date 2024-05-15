import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function SearchComponent() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]); // Dynamic categories from API
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 11; // Total number of pages assumed or dynamically set from API

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3500/api/v0/resources/stats/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCategories(data.totalPerTag.map(tag => tag.tag)); // Assuming the response structure has a 'totalPerTag' field
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = selectedCategory ?
                    `/api/v0/resources/tags/${selectedCategory}?page=${currentPage}&limit=20` :
                    `/api/v0/resources?page=${currentPage}&limit=20`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setItems(data.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, selectedCategory]); // Dependency on currentPage and selectedCategory

    if (loading && !error) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <input type="text" placeholder="Search..." style={{ width: "500px", marginBottom:"20px" }} />
            <section style={{ display: "flex", flexDirection: "row", maxWidth: "1000px" }}>
                <nav style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "start", width: "100%" }}>
                    {categories.map((category, index) => (
                        <label key={index} style={{ margin: "5px" }}>
                            <input
                                type="radio"
                                name="category"
                                value={category}
                                checked={selectedCategory === category}
                                onChange={() => setSelectedCategory(category)}
                                style={{ marginRight: "5px" }}/>
                            {category}
                        </label>
                    ))}
                </nav>
                <aside style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <ul style={{ width: "100%", listStyleType: "none" }}>
                        {items.map(item => (
                            <li key={item._id} style={{ marginBottom: "10px", minWidth: "800px" }}>
                                <strong>{item.name}</strong> - {item.description}
                            </li>
                        ))}
                    </ul>
                    <div>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} onClick={() => setCurrentPage(i + 1)} style={{ margin: "0 5px" }}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </aside>
            </section>
        </div>
    );
}

ReactDOM.render(<SearchComponent />, document.getElementById('root'));
