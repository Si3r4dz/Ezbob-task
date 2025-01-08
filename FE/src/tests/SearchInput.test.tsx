import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchInput from '../components/SearchInput/SearchInput';
import { SearchContext } from '../components/SearchProvider/SearchProvider';

describe('SearchInput', () => {
    const mockContextValue = {
        autocompleteSearch: jest
            .fn()
            .mockResolvedValue([{ id: 1, title: 'apple', imageUrl: '', description: '', url: '' }]),
        addToSearchHistory: jest.fn(),
        performSearch: jest.fn()
    };

    function renderWithContext() {
        return render(
            <SearchContext.Provider value={mockContextValue as any}>
                <SearchInput />
            </SearchContext.Provider>
        );
    }

    it('renders input field', () => {
        renderWithContext();
        expect(screen.getByPlaceholderText(/Search in SEARCHER/i)).toBeInTheDocument();
    });

    it('updates value on change', async () => {
        renderWithContext();
        const input = screen.getByPlaceholderText(/Search in SEARCHER/i);
        await act(async () => {
            fireEvent.change(input, { target: { value: 'test' } });
        });
        expect(input).toHaveValue('test');
    });

    it('calls autocompleteSearch on input change', async () => {
        renderWithContext();
        const input = screen.getByPlaceholderText(/Search in SEARCHER/i);
        await act(async () => {
            fireEvent.change(input, { target: { value: 'test' } });
        });
        expect(mockContextValue.autocompleteSearch).toHaveBeenCalledWith('test');
    });
});
