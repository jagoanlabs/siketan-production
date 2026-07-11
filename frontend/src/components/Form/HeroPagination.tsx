import {
  PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from "@heroui/react";

export const Pagination = ({ total, page, onChange, className, showControls, ...props }: any) => {
  const handlePageChange = (p: number) => {
    if (onChange) {
      onChange(p);
    }
  };

  const getPages = () => {
    const pages: any[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(total - 1, page + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (page < total - 2) pages.push("...");
      if (!pages.includes(total)) pages.push(total);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <PaginationRoot className={className} {...props}>
      <PaginationContent className="flex gap-1 items-center justify-center list-none pl-0">
        {showControls && (
          <PaginationPrevious
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 text-xs"
            onPress={() => handlePageChange(Math.max(1, page - 1))}
            isDisabled={page <= 1}
          >
            ◀
          </PaginationPrevious>
        )}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis className="px-2 text-gray-400" />
              </PaginationItem>
            );
          }
          const isActive = p === page;
          return (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={isActive}
                onPress={() => handlePageChange(p)}
                className={`w-8 h-8 flex items-center justify-center text-xs rounded font-medium cursor-pointer ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {showControls && (
          <PaginationNext
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 text-xs"
            onPress={() => handlePageChange(Math.min(total, page + 1))}
            isDisabled={page >= total}
          >
            ▶
          </PaginationNext>
        )}
      </PaginationContent>
    </PaginationRoot>
  );
};
