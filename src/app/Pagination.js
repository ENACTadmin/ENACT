import React from 'react';

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const pageNumbers = Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);

  return (
    <div>
      <button 
        onClick={() => setCurrentPage(1)} 
        disabled={currentPage === 1}
        style={{ margin: "0 5px" }}>
        First
      </button>
      <button 
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
        disabled={currentPage === 1}
        style={{ margin: "0 5px" }}>
        Prev
      </button>
      {pageNumbers.map((number) => (
        <button 
          key={number}
          onClick={() => setCurrentPage(number)}
          style={{ margin: "0 5px", fontWeight: currentPage === number ? 'bold' : 'normal' }}>
          {number}
        </button>
      ))}
      <button 
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
        disabled={currentPage === totalPages}
        style={{ margin: "0 5px" }}>
        Next
      </button>
      <button 
        onClick={() => setCurrentPage(totalPages)} 
        disabled={currentPage === totalPages}
        style={{ margin: "0 5px" }}>
        Last
      </button>
    </div>
  );
};

export default Pagination;
