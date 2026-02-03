import { SearchType } from "@/service/search-service";

interface CategoryTabsProps {
  searchType: SearchType;
  searchQuery: string;
  resultCounts: {
    all: number;
    product: number;
    toko: number;
    berita: number;
    lomba: number;
  };
  onCategoryChange: (type: SearchType) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  searchType,
  searchQuery,
  resultCounts,
  onCategoryChange,
}) => {
  const categories: SearchType[] = [
    "all",
    "product",
    "toko",
    "berita",
    "lomba",
  ];

  const getCategoryLabel = (category: SearchType) => {
    const labels: Record<any, string> = {
      all: `Semua ${searchQuery ? `(${resultCounts.all})` : ""}`,
      product: `Produk ${searchQuery ? `(${resultCounts.product})` : ""}`,
      toko: `Toko ${searchQuery ? `(${resultCounts.toko})` : ""}`,
      berita: `Berita ${searchQuery ? `(${resultCounts.berita})` : ""}`,
      lomba: `Lomba/Event ${searchQuery ? `(${resultCounts.lomba})` : ""}`,
    };

    return labels[category];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              searchType === category
                ? "bg-[#1167B1] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>
    </div>
  );
};
