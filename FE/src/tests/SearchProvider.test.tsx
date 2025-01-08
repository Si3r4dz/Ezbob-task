import React from 'react';
import { render } from '@testing-library/react';
import SearchProvider, { SearchContext } from '../components/SearchProvider/SearchProvider';

describe('SearchProvider', () => {
    it('provides context values', () => {
        let contextValues: any;

        render(
            <SearchProvider>
                <SearchContext.Consumer>
                    {(value) => {
                        contextValues = value;
                        return null;
                    }}
                </SearchContext.Consumer>
            </SearchProvider>
        );

        expect(contextValues).toBeDefined();
        expect(contextValues.searchHistory).toBeInstanceOf(Set);
        expect(typeof contextValues.addToSearchHistory).toBe('function');
    });
});
