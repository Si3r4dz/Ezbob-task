export interface DBItem {
    id: number;
    title: string;
    description: string;
    url: string;
  }

  export interface SearchResponse {
    page: number;
    pageSize: number;
    totalResults: number;
    totalPages: number;
    results: DBItem[];
    query: string;
  }

  const BASE_URL = 'http://localhost:3001/api';
  /**
   * Calls backend:
   *   GET /api/search?query=...&page=...&pageSize=...
   */
  export async function fetchSearch(
    query: string,
    page = 1,
    pageSize = 10
  ): Promise<SearchResponse> {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    const url = `${BASE_URL}/search?${params}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }
    return (await response.json()) as SearchResponse;
  }
