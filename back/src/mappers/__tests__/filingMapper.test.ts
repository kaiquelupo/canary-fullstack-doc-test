import { mapFiling, mapFilings, BASE_URL } from '../filingMapper';
import { FilingDTO } from '../../dtos/FilingDTO';

describe('filingMapper', () => {
  describe('mapFiling', () => {
    it('should correctly map a FilingDTO to a Filing', () => {
      const filingDTO: FilingDTO = {
        _id: '0000320193-24-000123:aapl-20240928.htm',
        _source: {
          file_type: '10-K',
          file_date: '2023-04-24',
        },
      };

      const cik = '0000320193';
      const result = mapFiling(filingDTO, cik);

      expect(result).toEqual({
        url: `${BASE_URL}/320193/000032019324000123/aapl-20240928.htm`,
        type: '10-K',
        date: new Date('2023-04-24'),
      });
    });

    it('should normalize the CIK by removing leading zeros', () => {
      const filingDTO: FilingDTO = {
        _id: '0000320193-24-000123:aapl-20240928.htm',
        _source: {
          file_type: '10-Q',
          file_date: '2023-06-15',
        },
      };

      const cik = '000000320193'; // CIK with leading zeros
      const result = mapFiling(filingDTO, cik);

      expect(result.url).toBe(
        `${BASE_URL}/320193/000032019324000123/aapl-20240928.htm`,
      );
    });
  });

  describe('mapFilings', () => {
    it('should correctly map an array of FilingDTOs to an array of Filings', () => {
      const filingsDTO: FilingDTO[] = [
        {
          _id: '0000320193-24-000123:aapl-20240928.htm',
          _source: {
            file_type: '10-K',
            file_date: '2023-04-24',
          },
        },
        {
          _id: '0000320193-24-000124:aapl-20240929.htm',
          _source: {
            file_type: '10-Q',
            file_date: '2023-06-15',
          },
        },
      ];

      const cik = '0000320193';
      const result = mapFilings(filingsDTO, cik);

      expect(result).toEqual([
        {
          url: `${BASE_URL}/320193/000032019324000123/aapl-20240928.htm`,
          type: '10-K',
          date: new Date('2023-04-24'),
        },
        {
          url: `${BASE_URL}/320193/000032019324000124/aapl-20240929.htm`,
          type: '10-Q',
          date: new Date('2023-06-15'),
        },
      ]);
    });

    it('should return an empty array if no filings are provided', () => {
      const result = mapFilings([], '0000320193');
      expect(result).toEqual([]);
    });
  });
});
