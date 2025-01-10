import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];

        if (currentPage > 3) {
            pageNumbers.push(
                <button
                    key={1}
                    onClick={() => handlePageClick(1)}
                    className="px-3 py-1 mx-1 border rounded bg-gray-200 hover:bg-blue-500 hover:text-white"
                >
                    1
                </button>
            );

            if (currentPage > 4) {
                pageNumbers.push(<span key="start-ellipsis" className="mx-2">...</span>);
            }
        }

        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`px-3 py-1 mx-1 border rounded ${
                        i === currentPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                    }`}
                >
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) {
                pageNumbers.push(<span key="end-ellipsis" className="mx-2">...</span>);
            }

            pageNumbers.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageClick(totalPages)}
                    className="px-3 py-1 mx-1 border rounded bg-gray-200 hover:bg-blue-500 hover:text-white"
                >
                    {totalPages}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="flex justify-center items-center mt-4">
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-1 border rounded ${
                    currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                }`}
            >
                « Trang trước
            </button>
            {renderPageNumbers()}
            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 mx-1 border rounded ${
                    currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                }`}
            >
                Trang sau »
            </button>
        </div>
    );
};

export default Pagination;
