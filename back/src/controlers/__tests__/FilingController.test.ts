import { Request, Response } from 'express';
import FilingController from '../FilingController';
import FilingService from '../../services/FillingService';

jest.mock('../../services/FillingService');

describe('FilingController', () => {
  let filingController: FilingController;
  let mockFilingService: jest.Mocked<FilingService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockFilingService = new FilingService(
      {} as any, //eslint-disable-line @typescript-eslint/no-explicit-any
    ) as jest.Mocked<FilingService>;
    mockFilingService.getLastDocuments = jest.fn();

    filingController = new FilingController();
    (filingController as any).filingService = mockFilingService; //eslint-disable-line @typescript-eslint/no-explicit-any

    mockRequest = {
      params: { id: '123456' },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original console.error after each test
  });

  it('should return filings with status 200 if filings are found', async () => {
    const mockFilings = {
      last: { type: '10-K', date: new Date('2023-04-24'), url: 'mocked-url' },
      previous: {
        type: '10-Q',
        date: new Date('2023-01-01'),
        url: 'mocked-url-2',
      },
    };

    mockFilingService.getLastDocuments.mockResolvedValue(mockFilings);

    await filingController.getLastDocuments(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockFilingService.getLastDocuments).toHaveBeenCalledWith('123456');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockFilings);
  });

  it('should return 404 if no filings are found', async () => {
    mockFilingService.getLastDocuments.mockResolvedValue(undefined);

    await filingController.getLastDocuments(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockFilingService.getLastDocuments).toHaveBeenCalledWith('123456');
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'No filings found',
    });
  });

  it('should return 500 if an error occurs', async () => {
    mockFilingService.getLastDocuments.mockRejectedValue(
      new Error('Service error'),
    );

    await filingController.getLastDocuments(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockFilingService.getLastDocuments).toHaveBeenCalledWith('123456');
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
    });
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching filings:',
      expect.any(Error),
    );
  });
});
