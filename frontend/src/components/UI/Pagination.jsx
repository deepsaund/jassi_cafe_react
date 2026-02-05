import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage = 10,
    totalItems = 0
}) => {
    const { theme } = useTheme();
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
        <div className={`flex flex-col md:flex-row items-center justify-between px-6 py-6 rounded-[2rem] gap-4 transition-all duration-500 ${theme === 'dark'
                ? 'bg-white/5 border border-white/5'
                : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50'
            }`}>
            {/* Info Section */}
            <div className={`text-xs uppercase tracking-[0.2em] font-black ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Showing <span className={theme === 'dark' ? 'text-blue-400' : 'text-slate-900'}>{startItem}</span> to{' '}
                <span className={theme === 'dark' ? 'text-blue-400' : 'text-slate-900'}>{endItem}</span> of{' '}
                <span className={theme === 'dark' ? 'text-blue-400' : 'text-slate-900'}>{totalItems}</span> identities
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-3">
                {/* Navigation Group */}
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/20 backdrop-blur-md">
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className={`p-2.5 rounded-xl transition-all ${theme === 'dark'
                                ? 'text-slate-500 hover:text-white hover:bg-white/10'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                            } disabled:opacity-20 disabled:cursor-not-allowed`}
                    >
                        <ChevronsLeft size={16} />
                    </button>

                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2.5 rounded-xl transition-all ${theme === 'dark'
                                ? 'text-slate-500 hover:text-white hover:bg-white/10'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                            } disabled:opacity-20 disabled:cursor-not-allowed`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                </div>

                {/* Page Numbers */}
                <div className="flex gap-1.5">
                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[42px] h-[42px] rounded-xl text-[11px] font-black transition-all ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105 rotate-3'
                                    : theme === 'dark'
                                        ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm border border-slate-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/20 backdrop-blur-md">
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2.5 rounded-xl transition-all ${theme === 'dark'
                                ? 'text-slate-500 hover:text-white hover:bg-white/10'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                            } disabled:opacity-20 disabled:cursor-not-allowed`}
                    >
                        <ChevronRight size={16} />
                    </button>

                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`p-2.5 rounded-xl transition-all ${theme === 'dark'
                                ? 'text-slate-500 hover:text-white hover:bg-white/10'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                            } disabled:opacity-20 disabled:cursor-not-allowed`}
                    >
                        <ChevronsRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
