import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
  memo,
} from 'react';
import { SearchContext } from '../SearchProvider/SearchProvider';
import { DBItem } from '../../services/SearchService';
import AutocompleteList from '../AutocompleteList/AutocompleteList';
import {ReactComponent as MagnifyingGlassIcon} from '../../assets/icons/magnify-icon.svg';
import {ReactComponent as CloseIcon} from '../../assets/icons/close-icon.svg';
import {ReactComponent as MicrophoneIcon} from '../../assets/icons/mic-icon.svg';
import './styles.css';

const SearchInput = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('SearchInput must be used within a SearchProvider');
  }

  const { autocompleteSearch, addToSearchHistory, performSearch } = ctx;

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<DBItem[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!showAutocomplete) setShowAutocomplete(true);

      const value = e.target.value;
      setQuery(value);

      if (!value) {
        setSuggestions([]);
        return;
      }

      try {
        const result = await autocompleteSearch(value);
        // Only update if suggestions actually changed
        setSuggestions((prev) => {
          if (
            prev.length === result.length &&
            prev.every((item, i) => item.id === result[i].id)
          ) {
            return prev;
          }
          return result;
        });
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    },
    [autocompleteSearch, showAutocomplete]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  }, [setQuery]);

  const handleFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowAutocomplete(true);
    }
  }, [suggestions]);

  const handleBlur = useCallback(() => {
    const timer = setTimeout(() => {
      setShowAutocomplete(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // On Enter = do a full search
  const handleKeyDown = useCallback(
    async (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (query) {
          try {
            await performSearch(query);
            addToSearchHistory(query);
            setShowAutocomplete(false);
          } catch (err) {
            console.error('Search error:', err);
          }
        }
      }
    },
    [query, performSearch,addToSearchHistory]
  );

  // If user clicks on a suggestion
  const handleSelect = useCallback(
    async (selected: string) => {
      setQuery(selected);
      setShowAutocomplete(false);

      try {
        await performSearch(selected);
        addToSearchHistory(selected);
      } catch (err) {
        console.error('Search error:', err);
      }
    },
    [performSearch, addToSearchHistory, ]
  );

  return (
  <div className={`google-search-wrapper `}>
    <div className="google-search-bar">
      <div className="search-icon-area">
        <MagnifyingGlassIcon />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="google-search-input"
        value={query}
        placeholder="Search Google or type a URL"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {query && (
        <div className="clear-icon-area" onClick={handleClear}>
          <CloseIcon />
        </div>
        )}
      <div className="mic-icon-area">
        <MicrophoneIcon />
      </div>
    </div>
    {showAutocomplete && suggestions.length > 0 && (
      <AutocompleteList suggestions={suggestions} onSelect={handleSelect} />
    )}
  </div>
  );
};

export default memo(SearchInput);
