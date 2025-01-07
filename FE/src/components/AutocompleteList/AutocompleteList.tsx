import React, { memo, MouseEvent, useContext, useState, useEffect, FC, useCallback } from 'react';
import { DBItem } from '../../services/SearchService';
import { SearchContext } from '../SearchProvider/SearchProvider';
import AutocompleteListItem from './AutocompleteListItem';
import './styles.css';

interface Props {
  suggestions: DBItem[];
  onSelect: (title: string) => void;
}

const AutocompleteList: FC<Props> = ({ suggestions, onSelect }) => {
  console.log('AutocompleteList render');
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('AutocompleteList must be used within SearchProvider');
  }

  const { searchHistory, removeFromSearchHistory } = ctx;
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleClick = useCallback((item: DBItem) => {
    onSelect(item.title);
  },[onSelect]);

  const handleRemove = useCallback((e: MouseEvent<HTMLButtonElement>, title: string) => {
    e.stopPropagation();
    removeFromSearchHistory(title);
  },[removeFromSearchHistory]);

  useEffect(() => {
    if (!suggestions.length) {
      setSelectedIndex(-1);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        const title = suggestions[selectedIndex].title;
        onSelect(title);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, suggestions, onSelect]);

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