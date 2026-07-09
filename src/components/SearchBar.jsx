import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, copy }) {
  return (
    <label className="search-bar" aria-label={copy.searchLabel}>
      <Search size={18} strokeWidth={2.4} aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        placeholder={copy.searchPlaceholder}
      />
      {value ? (
        <button
          className="search-clear"
          type="button"
          onClick={() => onChange('')}
          aria-label={copy.clearSearch}
        >
          <X size={16} strokeWidth={2.6} aria-hidden="true" />
        </button>
      ) : null}
    </label>
  );
}
