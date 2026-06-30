"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_OPTIONS } from "../hooks/usePagination";

interface ProblemPaginationProps {
  currentPage: number;
  pageSize: number;
  rangeFrom: number;
  rangeTo: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const ProblemPagination = ({
  currentPage,
  pageSize,
  rangeFrom,
  rangeTo,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: ProblemPaginationProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
      <div>
        Showing <span className="font-semibold text-zinc-100">{rangeFrom}</span>
        {" - "}
        <span className="font-semibold text-zinc-100">{rangeTo}</span> of{" "}
        <span className="font-semibold text-zinc-100">{totalItems}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span className="text-zinc-400">Rows</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="h-9 rounded-md border border-zinc-700 bg-zinc-800 px-2 text-zinc-100 outline-none focus:border-green-500"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
          >
            <ChevronLeft />
            Prev
          </Button>
          <span className="min-w-20 text-center text-zinc-400">
            {currentPage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProblemPagination;
