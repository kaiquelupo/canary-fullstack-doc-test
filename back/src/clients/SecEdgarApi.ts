import { FilingDTO } from '../dtos/FilingDTO';

const FAKE_EMAIL = 'email@email.com';

class SecEdgarApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://efts.sec.gov/LATEST/search-index';
  }

  async getFilings(
    cik: string,
    startdt: string,
    enddt: string,
    forms: string[],
  ): Promise<FilingDTO[] | undefined> {
    try {
      const queryParams = new URLSearchParams({
        dateRange: 'custom',
        category: 'custom',
        ciks: cik,
        startdt,
        enddt,
        forms: forms.join(','),
      });

      const response = await fetch(
        `${this.baseUrl}?${queryParams.toString()}`,
        {
          headers: {
            'User-Agent': FAKE_EMAIL,
          },
        },
      );

      const data = await response.json();

      const filings = data?.hits?.hits?.map((item: FilingDTO) => ({
        _id: item._id,
        _source: {
          file_type: item._source.file_type,
          file_date: item._source.file_date,
        },
      }));

      return filings;
    } catch (error) {
      console.error('Error fetching last documents:', error);
      return undefined;
    }
  }
}

export default SecEdgarApi;
