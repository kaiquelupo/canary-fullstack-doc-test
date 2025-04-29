import SecEdgarApi from '../SecEdgarApi';

global.fetch = jest.fn();

describe('SecEdgarApi', () => {
  let apiClient: SecEdgarApi;

  beforeEach(() => {
    apiClient = new SecEdgarApi();
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original console.error after each test
  });

  it('should fetch filings and return the mapped data', async () => {
    const mockResponse = {
      hits: {
        hits: [
          {
            _id: '0000320193-24-000123:aapl-20240928.htm',
            _source: {
              file_type: '10-K',
              file_date: '2023-04-24',
            },
          },
        ],
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await apiClient.getFilings(
      '123456',
      '2023-01-01',
      '2023-12-31',
      ['10-K', '10-Q'],
    );

    expect(fetch).toHaveBeenCalledWith(
      'https://efts.sec.gov/LATEST/search-index?dateRange=custom&category=custom&ciks=123456&startdt=2023-01-01&enddt=2023-12-31&forms=10-K%2C10-Q',
      {
        headers: {
          'User-Agent': 'email@email.com',
        },
      },
    );

    expect(result).toEqual([
      {
        _id: '0000320193-24-000123:aapl-20240928.htm',
        _source: {
          file_type: '10-K',
          file_date: '2023-04-24',
        },
      },
    ]);
  });

  it('should return undefined if the API response is invalid', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(null),
    });

    const result = await apiClient.getFilings(
      '123456',
      '2023-01-01',
      '2023-12-31',
      ['10-K', '10-Q'],
    );

    expect(result).toBeUndefined();
  });

  it('should handle fetch errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await apiClient.getFilings(
      '123456',
      '2023-01-01',
      '2023-12-31',
      ['10-K', '10-Q'],
    );

    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching last documents:',
      expect.any(Error),
    );
  });
});
