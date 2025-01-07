import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  FC,
  ReactNode,
} from 'react';
import { DBItem, fetchSearch, SearchResponse } from '../../services/SearchService';
import { debouncePromise } from './utils';


interface SearchContextProps {
  searchHistory: Set<string>;
  selectedResults: DBItem[];
  queryTime: number | null;
  addToSearchHistory: (title: string) => void;
  removeFromSearchHistory: (title: string) => void;
  autocompleteSearch: (query: string, pageSize?: number) => Promise<DBItem[]>;
  performSearch: (query: string, page?: number, pageSize?: number) => Promise<null>;
}

export const SearchContext = createContext<SearchContextProps | null>(
  null
);

interface Props {
  children: ReactNode;
}

const SearchProvider: FC<Props> = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState(new Set<string>());
  const [selectedResults, setSelectedResults] = useState<DBItem[]>([]);
  const [queryTime, setQueryTime] = useState<number | null>(null);

  const addToSearchHistory = useCallback((title: string) => {
    setSearchHistory((prev) => new Set(prev).add(title));
  }, []);

  const removeFromSearchHistory = useCallback((title: string) => {
    setSearchHistory((prev) => {
      const newSet = new Set(prev);
      newSet.delete(title);
      return newSet;
    });
  }, []);

  const _autocompleteSearch = useCallback(async (query: string, pageSize = 50) => {
    if (!query) return [];

    let data: SearchResponse;
    try {
      data = await fetchSearch(query, 1, pageSize);
    } catch (err) {
      console.error(err);
      return [];
    }
    const lower = query.toLowerCase();
    const startsWith = data.results.filter((item) =>
      item.title.toLowerCase().startsWith(lower)
    );
    return startsWith.slice(0, 10);
  }, []);

  const debouncedAutocompleteSearch = useMemo(
    () => debouncePromise(_autocompleteSearch, 300),
    []
  );

  const autocompleteSearch = useCallback(
    async (query: string, pageSize = 50) => {
      return debouncedAutocompleteSearch(query, pageSize);
    },
    [debouncedAutocompleteSearch]
  );

  const performSearch = useCallback(async (query: string, page = 1 , pageSize = 10): Promise<null> => {
      if (!query) return null;
      const startTime = performance.now();
      try {
        const data = await fetchSearch(query, page, pageSize);
        setSelectedResults(data.results);
      } catch (err) {
        console.error(err);
        setQueryTime(0);
      }
      const endTime = performance.now();
      setQueryTime(endTime - startTime);
      return null;
    }, []);

  const value = useMemo<SearchContextProps>(
    () => ({
      searchHistory,
      selectedResults,
      queryTime,
      addToSearchHistory,
      removeFromSearchHistory,
      autocompleteSearch,
      performSearch,
    }),
    [
      searchHistory,
      selectedResults,
      queryTime,
      addToSearchHistory,
      removeFromSearchHistory,
      autocompleteSearch,
      performSearch,
    ]
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
