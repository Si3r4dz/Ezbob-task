import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AutocompleteListItem from '../components/AutocompleteList/AutocompleteListItem';
import { DBItem } from '../services/SearchService';

describe('AutocompleteListItem', () => {
    const mockItem: DBItem = {
        id: 1,
        title: 'apple',
        imageUrl: '',
        description: '',
        url: ''
    };

    it('renders the item title', () => {
        render(
            <AutocompleteListItem
                item={mockItem}
                isInHistory={false}
                handleClick={jest.fn()}
                handleRemove={jest.fn()}
                isSelected={false}
            />
        );

        expect(screen.getByText('apple')).toBeInTheDocument();
    });

    it('calls handleClick on mouseDown', () => {
        const clickHandler = jest.fn();
        render(
            <AutocompleteListItem
                item={mockItem}
                isInHistory={false}
                handleClick={clickHandler}
                handleRemove={jest.fn()}
                isSelected={false}
            />
        );

        fireEvent.mouseDown(screen.getByText('apple'));
        expect(clickHandler).toHaveBeenCalledWith(mockItem);
    });

    it('shows remove button if isInHistory = true', () => {
        render(
            <AutocompleteListItem
                item={mockItem}
                isInHistory={true}
                handleClick={jest.fn()}
                handleRemove={jest.fn()}
                isSelected={false}
            />
        );
        expect(screen.getByText('Remove')).toBeInTheDocument();
    });
});
