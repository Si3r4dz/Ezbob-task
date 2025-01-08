import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchResults from '../components/SearchResults/SearchResults';
import { SearchContext } from '../components/SearchProvider/SearchProvider';
import { DBItem } from '../services/SearchService';

describe('SearchResults', () => {
    const mockContextValue = {
        selectedResults: [
            {
                id: 1,
                title: 'apple',
                imageUrl: '',
                description: 'desc',
                url: 'http://apple.com'
            }
        ] as DBItem[],
        queryTime: 123,
        totalPages: 1,
        allResultsCount: 1,
        currentPage: 1
    };

    function renderWithContext() {
        return render(
            // @eslint-disable-next-line
            <SearchContext.Provider value={mockContextValue as any}>
                <SearchResults />
            </SearchContext.Provider>
        );
    }

    it('renders results when available', () => {
        renderWithContext();

        const appleLinks = screen.getAllByText('Apple');
        expect(appleLinks).toHaveLength(2);
    });

    it('shows queryTime in the text', () => {
        renderWithContext();

        expect(screen.getByText(/Found in/i)).toBeInTheDocument();
        expect(screen.getByText(/123/i)).toBeInTheDocument();
    });
});
