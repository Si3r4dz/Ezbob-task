import React, { memo, MouseEvent, useContext, FC, useCallback } from 'react';
import { DBItem } from '../../services/SearchService';
import { SearchContext } from '../SearchProvider/SearchProvider';
import AutocompleteListItem from './AutocompleteListItem';
import './styles.css';

interface Props {
    suggestions: DBItem[];
    onSelect: (title: string) => void;
    selectedIndex: number;
}

const AutocompleteList: FC<Props> = ({ suggestions, onSelect, selectedIndex }) => {
    const ctx = useContext(SearchContext);
    if (!ctx) {
        throw new Error('AutocompleteList must be used within SearchProvider');
    }

    const { searchHistory, removeFromSearchHistory } = ctx;

    const handleClick = useCallback(
        (item: DBItem) => {
            onSelect(item.title);
        },
        [onSelect]
    );

    const handleRemove = useCallback(
        (e: MouseEvent<HTMLButtonElement>, title: string) => {
            e.stopPropagation();
            e.preventDefault();
            removeFromSearchHistory(title);
        },
        [removeFromSearchHistory]
    );

    return (
        <ul className="autocomplete-list">
            {suggestions.map((item, index) => {
                const isInHistory = searchHistory.has(item.title);
                const isSelected = index === selectedIndex;
                return (
                    <AutocompleteListItem
                        key={item.id}
                        item={item}
                        isInHistory={isInHistory}
                        handleClick={handleClick}
                        handleRemove={handleRemove}
                        isSelected={isSelected}
                    />
                );
            })}
        </ul>
    );
};

export default memo(AutocompleteList);
