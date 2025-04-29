import FilingService from '../FillingService';
import SecEdgarApi from '../../clients/SecEdgarApi';
import { BASE_URL } from '../../mappers/filingMapper';

jest.mock('../../clients/secEdgarApi'); // Mock the API client

describe('FilingService', () => {
  let filingService: FilingService;
  let mockApiClient: jest.Mocked<SecEdgarApi>;

  beforeEach(() => {
    mockApiClient = new SecEdgarApi() as jest.Mocked<SecEdgarApi>;
    filingService = new FilingService(mockApiClient);
  });

  it('should fetch and process filings correctly', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-31'));

    mockApiClient.getFilings.mockResolvedValue([
      {
        _id: '0000320193-24-000123:aapl-20240928.htm',
        _source: { file_type: '10-K', file_date: '2023-04-24' },
      },
    ]);

    const result = await filingService.getLastDocuments('123456');
    expect(result).toEqual({
      last: {
        url: `${BASE_URL}/123456/000032019324000123/aapl-20240928.htm`,
        type: '10-K',
        date: new Date('2023-04-24'),
      },
      previous: undefined,
    });
  });

  it('should return undefined if no filings are returned by the API', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-31'));

    mockApiClient.getFilings.mockResolvedValue(undefined);

    const result = await filingService.getLastDocuments('123456');
    expect(result).toBeUndefined();
    expect(mockApiClient.getFilings).toHaveBeenCalledWith(
      '123456',
      '2021-12-31',
      '2023-12-31',
      ['10-K', '10-Q'],
    );
  });

  it('should return last filing and previous 10-K if last filing is 10-K', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-31'));

    mockApiClient.getFilings.mockResolvedValue([
      {
        _id: '1:aapl-4.htm',
        _source: { file_type: '10-K', file_date: '2023-01-01' },
      },
      {
        _id: '2:aapl-5.htm',
        _source: { file_type: '10-Q', file_date: '2022-01-01' },
      },
      {
        _id: '3:aapl-6.htm',
        _source: { file_type: '10-K', file_date: '2021-01-01' },
      },
    ]);

    const result = await filingService.getLastDocuments('123456');
    expect(result).toEqual({
      last: {
        type: '10-K',
        date: new Date('2023-01-01'),
        url: `${BASE_URL}/123456/1/aapl-4.htm`,
      },
      previous: {
        type: '10-K',
        date: new Date('2021-01-01'),
        url: `${BASE_URL}/123456/3/aapl-6.htm`,
      },
    });
  });

  it('should return last filing and previous 10-Q if last filing is 10-Q not in the first quarter and there is no 10-K between', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-31'));

    mockApiClient.getFilings.mockResolvedValue([
      {
        _id: '1:aapl-4.htm',
        _source: { file_type: '10-Q', file_date: '2023-06-01' },
      },
      {
        _id: '2:aapl-5.htm',
        _source: { file_type: '10-Q', file_date: '2022-01-01' },
      },
      {
        _id: '3:aapl-6.htm',
        _source: { file_type: '10-K', file_date: '2021-01-01' },
      },
    ]);

    const result = await filingService.getLastDocuments('123456');
    expect(result).toEqual({
      last: {
        type: '10-Q',
        date: new Date('2023-06-01'),
        url: `${BASE_URL}/123456/1/aapl-4.htm`,
      },
      previous: {
        type: '10-Q',
        date: new Date('2022-01-01'),
        url: `${BASE_URL}/123456/2/aapl-5.htm`,
      },
    });
  });

  it('should return last filing and previous 10-K if last filing is 10-Q in the first quarter', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-31'));

    mockApiClient.getFilings.mockResolvedValue([
      {
        _id: '1:aapl-4.htm',
        _source: { file_type: '10-Q', file_date: '2023-01-01' },
      },
      {
        _id: '2:aapl-5.htm',
        _source: { file_type: '10-Q', file_date: '2022-01-01' },
      },
      {
        _id: '3:aapl-6.htm',
        _source: { file_type: '10-K', file_date: '2021-01-01' },
      },
    ]);

    const result = await filingService.getLastDocuments('123456');
    expect(result).toEqual({
      last: {
        type: '10-Q',
        date: new Date('2023-01-01'),
        url: `${BASE_URL}/123456/1/aapl-4.htm`,
      },
      previous: {
        type: '10-K',
        date: new Date('2021-01-01'),
        url: `${BASE_URL}/123456/3/aapl-6.htm`,
      },
    });
  });
});
