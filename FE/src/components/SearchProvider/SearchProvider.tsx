import React, { createContext, useState, useCallback, useMemo, FC, ReactNode } from 'react';
import { DBItem, fetchSearch, SearchResponse } from '../../services/SearchService';
import { debouncePromise } from './utils';

export interface SearchContextProps {
    searchHistory: Set<string>;
    selectedResults: DBItem[];
    queryTime: number | null;
    currentPage: number;
    totalPages: number;
    currentQuery: string;
    allResultsCount: number;
    addToSearchHistory: (title: string) => void;
    removeFromSearchHistory: (title: string) => void;
    autocompleteSearch: (query: string, pageSize?: number) => Promise<DBItem[]>;
    performSearch: (query: string, page?: number, pageSize?: number) => Promise<null>;
    setCurrentQuery: (val: string) => void;
    setPage: (page: number) => void;
}

export const SearchContext = createContext<SearchContextProps | null>(null);

interface Props {
    children: ReactNode;
}

const SearchProvider: FC<Props> = ({ children }) => {
    const [searchHistory, setSearchHistory] = useState(new Set<string>());
    const [selectedResults, setSelectedResults] = useState<DBItem[]>([]);
    const [queryTime, setQueryTime] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentQuery, setCurrentQuery] = useState('');
    const [allResultsCount, setAllResultsCount] = useState(0);

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
        [_autocompleteSearch]
    );

    const autocompleteSearch = useCallback(
        async (query: string, pageSize = 50) => {
            return debouncedAutocompleteSearch(query, pageSize);
        },
        [debouncedAutocompleteSearch]
    );

    const performSearch = useCallback(
        async (query: string, page = 1, pageSize = 10): Promise<null> => {
            if (!query) return null;
            setCurrentQuery(query);
            setCurrentPage(page);
            const startTime = performance.now();
            try {
                const data = await fetchSearch(query, page, pageSize);
                setSelectedResults(data.results);
                setCurrentPage(data.page);
                setTotalPages(data.totalPages);
                setAllResultsCount(data.totalResults);
            } catch (err) {
                console.error(err);
                setQueryTime(0);
            }
            const endTime = performance.now();
            setQueryTime(parseFloat((endTime - startTime).toFixed(2)));
            return null;
        },
        []
    );

    const setPage = useCallback(
        (page: number) => {
            performSearch(currentQuery, page);
        },
        [currentQuery, performSearch]
    );

    const value = useMemo<SearchContextProps>(
        () => ({
            searchHistory,
            selectedResults,
            queryTime,
            currentPage,
            totalPages,
            currentQuery,
            allResultsCount,
            addToSearchHistory,
            removeFromSearchHistory,
            autocompleteSearch,
            performSearch,
            setCurrentQuery,
            setPage
        }),
        [
            searchHistory,
            selectedResults,
            queryTime,
            currentPage,
            totalPages,
            currentQuery,
            allResultsCount,
            addToSearchHistory,
            removeFromSearchHistory,
            autocompleteSearch,
            performSearch,
            setCurrentQuery,
            setPage
        ]
    );

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export default SearchProvider;
