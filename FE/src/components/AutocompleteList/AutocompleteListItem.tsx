import React from 'react';
import { DBItem } from '../../services/SearchService';
import MagnifyingGlassIcon from '../IconComponent/MagnifyingGlassIcon';

interface AutocompleteListItemProps {
    item: DBItem;
    isInHistory: boolean;
    handleClick: (item: DBItem) => void;
    handleRemove: (e: React.MouseEvent<HTMLButtonElement>, title: string) => void;
    isSelected: boolean;
}

const AutocompleteListItem: React.FC<AutocompleteListItemProps> = ({
    item,
    isInHistory,
    handleClick,
    handleRemove,
    isSelected
}) => {
    return (
        <li
            key={item.id}
            className={`autocomplete-item ${isInHistory ? 'in-history' : ''} ${isSelected ? 'selected' : ''}`}
            onMouseDown={() => handleClick(item)}
        >
            <div className={`autocomplete-item-icon`}>
                <MagnifyingGlassIcon />
            </div>
            <span className="autocomplete-item-title">{item.title}</span>
            {isInHistory && (
                <button
                    className="remove-button"
                    onMouseDown={(e) => handleRemove(e, item.title)}
                >
                    Remove
                </button>
            )}
        </li>
    );
};

export default AutocompleteListItem;
