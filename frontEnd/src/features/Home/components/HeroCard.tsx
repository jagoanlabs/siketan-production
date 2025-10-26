import { FiSearch, FiX } from "react-icons/fi";
import { Button } from "@heroui/button";
import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { assets } from "../../../assets/assets";

import { ItemCard } from "./ItemCard";

const itemNav = [
  { image: assets.imageGraphPlant, id: "Data Pertanian", link: "/home/data" },
  {
    image: assets.imageCalenderClock,
    id: "Kegiatan",
    link: "/home/information",
  },
  { image: assets.imageNews, id: "Berita", link: "/home/information" },
  { image: assets.imageVegetables, id: "Toko Pertanian", link: "/home/toko" },
  { image: assets.imageFruitVegetable, id: "Produk", link: "/home/toko" },
  { image: assets.imageSignalPlant, id: "Cek NIK", scrollTo: "cek-nik" },
];

// Mock data (should be replaced with API data if available)
const mockProducts = [
  { id: 1, title: "Bibit Padi Unggul", type: "product" },
  { id: 2, title: "Pupuk Organik Berkualitas", type: "product" },
  { id: 3, title: "Pestisida Alami", type: "product" },
  { id: 4, title: "Alat Semprot Tanaman", type: "product" },
  { id: 5, title: "Benih Jagung Hibrida", type: "product" },
];
const mockStores = [
  { id: 1, title: "Toko Tani Jaya", type: "store" },
  { id: 2, title: "UD Maju Tani", type: "store" },
  { id: 3, title: "CV Berkah Tani", type: "store" },
  { id: 4, title: "Koperasi Tani Sejahtera", type: "store" },
];
const mockEvents = [
  {
    id: 1,
    title: "Pelatihan Teknologi Pertanian",
    type: "event",
    description: "Pelatihan teknologi pertanian terkini",
  },
  {
    id: 2,
    title: "Seminar Peningkatan Hasil Panen",
    type: "event",
    description: "Tips meningkatkan produktivitas lahan",
  },
  {
    id: 3,
    title: "Pameran Alat Pertanian",
    type: "event",
    description: "Pameran alat pertanian modern",
  },
];

export const HeroCard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);

  // Combine all data for searching
  const allData = useMemo(
    () => [
      ...mockProducts.map((p) => ({ ...p, searchText: p.title.toLowerCase() })),
      ...mockStores.map((s) => ({ ...s, searchText: s.title.toLowerCase() })),
      ...mockEvents.map((e) => ({
        ...e,
        searchText: `${e.title} ${e.description}`.toLowerCase(),
      })),
    ],
    [],
  );

  // Generate suggestions based on query
  const generateSuggestions = useCallback(
    (query: string) => {
      if (!query || query.length < 2) {
        setSuggestions([]);

        return;
      }
      const lowerQuery = query.toLowerCase();
      const uniqueSuggestions = new Set<string>();

      allData.forEach((item) => {
        if (item.searchText.includes(lowerQuery)) {
          uniqueSuggestions.add(item.title);
          const words = item.title.split(" ");

          words.forEach((word: string) => {
            if (word.toLowerCase().startsWith(lowerQuery)) {
              uniqueSuggestions.add(word);
            }
          });
        }
      });
      if (lowerQuery.length >= 3) {
        uniqueSuggestions.add(query);
      }
      setSuggestions(Array.from(uniqueSuggestions).slice(0, 8));
    },
    [allData],
  );

  // Debounced suggestion generation
  const debounce = (fn: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;

    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };
  const debouncedGenerateSuggestions = useMemo(
    () => debounce(generateSuggestions, 300),
    [generateSuggestions],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchQuery(value);
    debouncedGenerateSuggestions(value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
    if (searchQuery) debouncedGenerateSuggestions(searchQuery);
  };

  const handleInputBlur = () => {
    blurTimeout.current = setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Desktop Version - Floating Card */}
      <div className="hidden lg:block absolute w-[85%] xl:w-[80%] max-w-6xl p-6 xl:p-8 mx-auto bg-white border-2 border-gray-200 rounded-2xl shadow-xl bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
        <form
          className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-center"
          onSubmit={handleSearch}
        >
          <div className="relative flex-grow">
            <FiSearch className="absolute w-5 h-5 xl:w-6 xl:h-6 text-gray-400 top-3.5 left-3" />
            <input
              ref={inputRef}
              autoComplete="off"
              className="w-full py-3 xl:py-3.5 pl-10 xl:pl-12 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1167B1] focus:border-transparent transition-all"
              id="search-desktop"
              name="search"
              placeholder="Cari produk, toko, atau event..."
              type="text"
              value={searchQuery}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            {searchQuery && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
                type="button"
                onClick={handleClearSearch}
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-auto">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    type="button"
                    onMouseDown={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 xl:gap-4">
            <Button
              className="flex-1 px-6 text-white transition-colors h-13 bg-green-500 xl:flex-initial rounded-xl hover:bg-green-600"
              type="submit"
            >
              Cari
            </Button>
          </div>
        </form>
        <div className="w-full h-[1px] mt-6 bg-gray-200" />
        {/* Item cards */}
        <div className="grid grid-cols-6 gap-4 py-6">
          {itemNav.map((item, index) => (
            <ItemCard
              key={index}
              image={item.image}
              link={item.link}
              scrollTo={item.scrollTo}
              title={item.id}
            />
          ))}
        </div>
      </div>

      {/* Mobile Version - Separate Section */}
      <div className="bg-white border-t-2 border-gray-200 shadow-lg lg:hidden">
        <div className="max-w-2xl px-4 py-6 mx-auto sm:px-6">
          {/* Search Section */}
          <form
            className="flex flex-col gap-3 mb-6 sm:flex-row"
            onSubmit={handleSearch}
          >
            <div className="relative flex-grow">
              <FiSearch className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
              <input
                ref={inputRef}
                autoComplete="off"
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1167B1] focus:border-transparent"
                id="search-mobile"
                name="search"
                placeholder="Cari produk, toko, atau event..."
                type="text"
                value={searchQuery}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
              {searchQuery && (
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  type="button"
                  onClick={handleClearSearch}
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-auto">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      type="button"
                      onMouseDown={() => handleSuggestionClick(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button
                className="flex-1 px-6 text-white transition-colors bg-green-500 sm:flex-initial rounded-xl hover:bg-green-600 active:bg-green-700"
                type="submit"
              >
                Cari
              </Button>
            </div>
          </form>

          <div className="w-full h-[1px] bg-gray-200 mb-6" />

          {/* Item cards - Responsive Grid */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-6 sm:gap-4 jutify-center items-start">
            {itemNav.map((item, index) => (
              <ItemCard
                key={index}
                image={item.image}
                link={item.link}
                scrollTo={item.scrollTo}
                title={item.id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
