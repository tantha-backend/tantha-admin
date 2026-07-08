import { Search } from "lucide-react";
import Input from "./Input";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
      />

      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="pl-11"
      />
    </div>
  );
};

export default SearchBar;
