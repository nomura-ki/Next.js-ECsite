"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@/types/common";

interface Props {
  pagination: Pagination;
}

export default function PaginationControl({ pagination }: Props) {
  const router = useRouter();

  const changePage = (page: number) => {
    router.push(`/orders?page=${page}`);
  };

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        disabled={!pagination.hasPrev}
        onClick={() => changePage(pagination.currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        前へ
      </button>
      <span className="px-3 py-1">
        {pagination.currentPage} / {pagination.totalPages}
      </span>
      <button
        disabled={!pagination.hasNext}
        onClick={() => changePage(pagination.currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        次へ
      </button>
    </div>
  );
}
