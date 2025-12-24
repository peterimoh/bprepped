import { useState } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  scrollOnPageChange?: boolean;
  scrollBehavior?: ScrollBehavior;
}

export interface UsePaginationReturn {
  currentPage: number;
  limit: number;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
  handlePageChange: (page: number) => void;
  generatePageNumbers: (currentPage: number, totalPages: number) => number[];
}

export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    initialPage = 1,
    initialLimit = 10,
    scrollOnPageChange = true,
    scrollBehavior = 'smooth',
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (scrollOnPageChange) {
      window.scrollTo({ top: 0, behavior: scrollBehavior });
    }
  };

  const generatePageNumbers = (
    currentPage: number,
    totalPages: number
  ): number[] => {
    const pages: number[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(-1); // ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // ellipsis
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(-1); // ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return {
    currentPage,
    limit,
    setCurrentPage,
    setLimit,
    handlePageChange,
    generatePageNumbers,
  };
}
