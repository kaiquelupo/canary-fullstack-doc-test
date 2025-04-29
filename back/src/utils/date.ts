export const isFirstQuarter = (filingDate: Date) => {
  return filingDate.getUTCMonth() >= 0 && filingDate.getUTCMonth() <= 2;
};

export const getDateRange = (): { startDate: string; endDate: string } => {
  // Get a 2 years range of filings to guarantee that we have the last 10-K and 10-Q
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 2);
  const formattedStartDate = startDate.toISOString().split('T')[0];

  return { startDate: formattedStartDate, endDate };
};
