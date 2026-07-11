# Design System - SearchField

The `SearchField` component from HeroUI v3 is a compound search input that integrates an unstyled input primitive with a search icon and a clear button.

---

## Styling Design

The component uses a compound layout structure:
- **`SearchField.Group`**: The outer input wrapper border container.
- **`SearchField.SearchIcon`**: Search icon helper.
- **`SearchField.Input`**: Unstyled transparent search input.
- **`SearchField.ClearButton`**: Clear button helper to clear the query.

### Spacing & Borders
- Inner vertical and horizontal padding: `px-3.5 py-3`.
- Border Radius: `rounded-xl`.
- Focus highlight state uses the primary green color: `focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500`.

---

## Usage Example

### Basic Search Field Integration

```tsx
import { SearchField } from "@heroui/react";

<SearchField
  value={searchTerm}
  onChange={handleSearchChange}
>
  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 pl-1">
    Pencarian
  </span>
  <SearchField.Group className="w-full px-3.5 py-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 transition-colors flex items-center gap-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 min-h-[46px]">
    <SearchField.SearchIcon className="text-gray-400" />
    <SearchField.Input
      placeholder="Cari kategori, poktan/kelompok, kecamatan, desa..."
      className="bg-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none w-full text-sm text-gray-700 dark:text-gray-200"
    />
    {searchTerm && (
      <SearchField.ClearButton
        className="text-gray-400 hover:text-gray-600 cursor-pointer flex items-center justify-center"
        onClick={handleClearSearch}
      />
    )}
  </SearchField.Group>
</SearchField>
```
