import React, {
    useContext,
    useState,
    useRef,
    useEffect,
    useCallback,
    ChangeEvent,
    KeyboardEvent,
    memo
} from 'react';
import { SearchContext } from '../SearchProvider/SearchProvider';
import { DBItem } from '../../services/SearchService';
import AutocompleteList from '../AutocompleteList/AutocompleteList';
import './styles.css';
import MicIcon from '../IconComponent/MicIcon';
import CloseIcon from '../IconComponent/CloseIcon';
import MagnifyingGlassIcon from '../IconComponent/MagnifyingGlassIcon';

const SearchInput = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) {
        throw new Error('SearchInput must be used within a SearchProvider');
    }

    const { autocompleteSearch, addToSearchHistory, performSearch } = ctx;

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<DBItem[]>([]);
    const [showAutocomplete, setShowAutocomplete] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleChange = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            if (!showAutocomplete) setShowAutocomplete(true);
            if (selectedIndex !== -1) setSelectedIndex(-1);

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
                        prev.length === result?.length &&
                        prev.every((item, i) => item.id === result[i].id)
                    ) {
                        return prev;
                    }
                    return result;
                });
            } catch (err) {
                if (err instanceof Error && !(err as any).isCanceled) {
                    console.error('Autocomplete error:', err);
                }
            }
        },
        [autocompleteSearch, showAutocomplete, setSelectedIndex, selectedIndex]
    );

    const handleClear = useCallback(() => {
        setQuery('');
        setSuggestions([]);
        setSelectedIndex(-1);
        inputRef.current?.focus();
    }, []);

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

    const handleSelect = useCallback(
        async (selected: string) => {
            setQuery(selected);
            setShowAutocomplete(false);
            setSelectedIndex(-1);

            try {
                await performSearch(selected);
                addToSearchHistory(selected);
            } catch (err) {
                console.error('Search error:', err);
            }
        },
        [performSearch, addToSearchHistory]
    );

    const handleKeyDown = useCallback(
        async (e: KeyboardEvent<HTMLInputElement>) => {
            if (!showAutocomplete) setShowAutocomplete(true);
            switch (e.key) {
                case 'ArrowDown':
                    if (suggestions.length > 0) {
                        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
                    }
                    break;
                case 'ArrowUp':
                    if (suggestions.length > 0) {
                        setSelectedIndex((prev) => {
                            return (prev - 1 + suggestions.length) % suggestions.length;
                        });
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                        await handleSelect(suggestions[selectedIndex].title);
                    } else if (query) {
                        await handleSelect(query);
                    }
                    break;
                default:
                    break;
            }
        },
        [suggestions, selectedIndex, showAutocomplete, handleSelect, query]
    );

    useEffect(() => {
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            const selected = suggestions[selectedIndex].title;
            setQuery(selected);
        }
    }, [selectedIndex, suggestions]);

    const isAutoCompleteVisible = suggestions?.length > 0 && showAutocomplete;

    return (
        <div className="search-wrapper">
            <div className={`search-bar ${isAutoCompleteVisible ? 'active' : ''}`}>
                <div className="search-icon-area">
                    <MagnifyingGlassIcon />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    value={query}
                    placeholder="Search in SEARCHER"
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown} // arrow logic is here
                />
                {query && (
                    <>
                        <div className="clear-icon-area" onClick={handleClear}>
                            <CloseIcon />
                        </div>
                        <div className="separator-bar" />
                    </>
                )}
                <div className="mic-icon-area">
                    <MicIcon />
                </div>
            </div>

            {isAutoCompleteVisible && (
                <AutocompleteList
                    suggestions={suggestions}
                    onSelect={handleSelect}
                    selectedIndex={selectedIndex}
                />
            )}
        </div>
    );
};

export default memo(SearchInput);

