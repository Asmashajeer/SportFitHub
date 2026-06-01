import { SearchIcon } from 'lucide-react';

interface SearchProps {
  value?: string;
  onChange?: (val: string) => void;
}

const Search: React.FC<SearchProps> = ({ value = '', onChange = () => {} }) => {
  return (
    <div className=" p-2 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-800"
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Search;
