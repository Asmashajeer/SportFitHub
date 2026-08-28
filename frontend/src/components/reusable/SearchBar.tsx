import { Search, X } from 'lucide-react';
import { Input } from '../ui/Input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSearch?: () => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  onClear,
  onSearch,
  placeholder = 'Search...',
}: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-sm px-2 mx-2">
      {/* Search Icon */}
      <div className="absolute  inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>

      {/* Input Field */}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
        className="block w-full p-2 pl-8 pr-10 text-sm border border-gray-700 rounded-lg bg-transparent  focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
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
