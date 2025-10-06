import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationControls = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null; // Don't show pagination if there's only one page
    }

    const handlePageClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    return (
        <Pagination className="justify-content-center mt-4">
            <Pagination.First onClick={() => handlePageClick(1)} disabled={page === 1} />
            <Pagination.Prev onClick={() => handlePageClick(page - 1)} disabled={page === 1} />
            
            {/* Display current page info */}
            <Pagination.Item active>{`Page ${page} of ${totalPages}`}</Pagination.Item>

            <Pagination.Next onClick={() => handlePageClick(page + 1)} disabled={page === totalPages} />
            <Pagination.Last onClick={() => handlePageClick(totalPages)} disabled={page === totalPages} />
        </Pagination>
    );
};

export default PaginationControls;