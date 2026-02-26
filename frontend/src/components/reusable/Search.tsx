

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, onClear, placeholder = "Search..." }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-sm">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full py-2 pl-10 pr-10 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
        placeholder={placeholder}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 group"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;



