import { FilingDTO } from '../dtos/FilingDTO';
import { Filing } from '../interfaces';

export const BASE_URL = 'https://www.sec.gov/Archives/edgar/data';

export const mapFiling = (filing: FilingDTO, cik: string): Filing => {
  const normalizedCik = cik.replace(/^0+/, '');
  const path =
    filing._id.split(':')[0].replace(/-/g, '') + '/' + filing._id.split(':')[1];

  return {
    url: `${BASE_URL}/${normalizedCik}/${path}`,
    type: filing._source.file_type,
    date: new Date(filing._source.file_date),
  };
};

export const mapFilings = (filings: FilingDTO[], cik: string): Filing[] => {
  return filings.map((filing) => mapFiling(filing, cik));
};
