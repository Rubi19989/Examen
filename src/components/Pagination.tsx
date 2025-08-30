import React from "react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <nav className="mt-4 " aria-label="Paginación de productos">
            <ul className="pagination justify-content-center gap-4">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link "
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        aria-label="Anterior"
                    >
                        &laquo;
                    </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => (
                    <li
                        key={i}
                        className={`page-item ${page === i + 1 ? "active" : ""}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChange(i + 1)}
                            aria-label={`Ir a la página ${i + 1}`}
                        >
                            {i + 1}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        aria-label="Siguiente"
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>

    );
};

export { Pagination };
