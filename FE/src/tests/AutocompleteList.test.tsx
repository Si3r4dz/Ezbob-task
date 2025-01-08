import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AutocompleteList from '../components/AutocompleteList/AutocompleteList';
import { SearchContext } from '../components/SearchProvider/SearchProvider';
import { DBItem } from '../services/SearchService';

describe('AutocompleteList', () => {
    const mockSuggestions: DBItem[] = [
        { id: 1, title: 'apple', imageUrl: '', description: '', url: '' },
        { id: 2, title: 'banana', imageUrl: '', description: '', url: '' }
    ];
    const mockOnSelect = jest.fn();
    const mockContextValue = {
        searchHistory: new Set<string>(['apple']),
        removeFromSearchHistory: jest.fn()
    };

    function renderWithContext(selectedIndex = -1) {
        return render(
            <SearchContext.Provider value={mockContextValue as any}>
                <AutocompleteList
                    suggestions={mockSuggestions}
                    onSelect={mockOnSelect}
                    selectedIndex={selectedIndex}
                />
            </SearchContext.Provider>
        );
    }

    it('renders list items correctly', () => {
        renderWithContext();
        expect(screen.getByText('apple')).toBeInTheDocument();
        expect(screen.getByText('banana')).toBeInTheDocument();
    });

    it('calls onSelect when item is clicked', () => {
        renderWithContext();
        fireEvent.mouseDown(screen.getByText('apple'));
        expect(mockOnSelect).toHaveBeenCalledWith('apple');
    });
});
