import SecEdgarApi from '../clients/SecEdgarApi';
import { Filing, LastAndPreviousDocuments } from '../interfaces';
import { mapFilings } from '../mappers/filingMapper';
import { getDateRange, isFirstQuarter } from '../utils/date';

class FilingService {
  constructor(private apiClient: SecEdgarApi) {
    this.apiClient = apiClient;
  }

  private getLastAndPreviousDocuments = (
    filings: Filing[],
  ): LastAndPreviousDocuments | undefined => {
    if (filings.length === 0) {
      return;
    }

    const [lastFiling, ...otherFilings] = filings;
    let previousFiling: Filing | undefined;

    if (
      lastFiling.type === '10-K' ||
      (lastFiling.type === '10-Q' && isFirstQuarter(lastFiling.date))
    ) {
      previousFiling = otherFilings.find((filing) => filing.type === '10-K');
    } else {
      const previous10Q = otherFilings.find((filing) => filing.type === '10-Q');
      const previous10K = otherFilings.find((filing) => filing.type === '10-K');

      if (previous10Q && previous10K) {
        previousFiling =
          previous10Q.date > previous10K.date ? previous10Q : previous10K;
      } else {
        previousFiling = previous10Q;
      }
    }

    return { last: lastFiling, previous: previousFiling };
  };

  getLastDocuments = async (
    cik: string,
  ): Promise<LastAndPreviousDocuments | undefined> => {
    try {
      const { startDate, endDate } = getDateRange();
      const rawFilings = await this.apiClient.getFilings(
        cik,
        startDate,
        endDate,
        ['10-K', '10-Q'],
      );

      if (!rawFilings) {
        return;
      }

      const filings = mapFilings(rawFilings, cik);

      return this.getLastAndPreviousDocuments(filings);
    } catch (error) {
      console.error('Error fetching filings:', error);
      return;
    }
  };
}

export default FilingService;
