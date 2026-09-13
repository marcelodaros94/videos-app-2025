interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <input
      type="text"
      placeholder="Busca por título, empresa, show o año..."
      className="w-full p-3 rounded border"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default SearchBar;
