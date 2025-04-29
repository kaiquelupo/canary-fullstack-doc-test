import { getDateRange, isFirstQuarter } from '../date';

describe('Date Utility Functions', () => {
  describe('getDateRange', () => {
    it('should return the correct date range', () => {
      jest.useFakeTimers().setSystemTime(new Date('2025-04-29'));

      const result = getDateRange();
      expect(result).toEqual({
        startDate: '2023-04-29',
        endDate: '2025-04-29',
      });

      jest.useRealTimers();
    });
  });

  describe('isFirstQuarter', () => {
    it('should return true for dates in the first quarter', () => {
      expect(isFirstQuarter(new Date('2025-01-01'))).toBe(true); // January
      expect(isFirstQuarter(new Date('2025-01-15'))).toBe(true); // January
      expect(isFirstQuarter(new Date('2025-03-31'))).toBe(true); // March
    });

    it('should return false for dates outside the first quarter', () => {
      expect(isFirstQuarter(new Date('2025-04-01'))).toBe(false); // April
      expect(isFirstQuarter(new Date('2025-12-31'))).toBe(false); // December
    });
  });
});
