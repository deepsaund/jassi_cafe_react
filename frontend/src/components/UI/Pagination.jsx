import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage = 10,
    totalItems = 0
}) => {
    const pages = [];
    const maxVisiblePages = 5;

    // Calculate page range to display
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-100">
            {/* Info Section */}
            <div className="text-sm text-slate-600 font-bold">
                Showing <span className="text-slate-900 font-black">{startItem}</span> to{' '}
                <span className="text-slate-900 font-black">{endItem}</span> of{' '}
                <span className="text-slate-900 font-black">{totalItems}</span> results
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="First Page"
                >
                    <ChevronsLeft size={18} />
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Previous"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="min-w-[40px] h-10 px-3 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-all"
                            >
                                1
                            </button>
                            {startPage > 2 && (
                                <span className="flex items-center px-2 text-slate-400 font-black">...</span>
                            )}
                        </>
                    )}

                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[40px] h-10 px-3 rounded-xl text-sm font-black transition-all ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <span className="flex items-center px-2 text-slate-400 font-black">...</span>
                            )}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="min-w-[40px] h-10 px-3 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-all"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                {/* Next Page */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Next"
                >
                    <ChevronRight size={18} />
                </button>

                {/* Last Page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Last Page"
                >
                    <ChevronsRight size={18} />
                </button>
            </div>
        </div>
    );
};
