// src/services/SearchService.test.ts
import { fetchSearch } from '../services/SearchService';

describe('fetchSearch', () => {
    beforeEach(() => {
        // Reset fetch mocks before each test
        global.fetch = jest.fn();
    });

    it('calls the correct endpoint and returns data', async () => {
        // Mock JSON response
        const mockResponse = {
            page: 1,
            pageSize: 10,
            totalResults: 100,
            totalPages: 10,
            results: [],
            query: 'test'
        };
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const data = await fetchSearch('test', 1, 10);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/search?query=test&page=1&pageSize=10')
        );
        expect(data).toEqual(mockResponse);
    });

    it('throws an error if response is not ok', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500
        });
        await expect(fetchSearch('test')).rejects.toThrow('Fetch error: 500');
    });
});
