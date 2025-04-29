import { Request, Response } from 'express';
import SecEdgarApi from '../clients/SecEdgarApi';
import FilingService from '../services/FillingService';
import { addScriptsToHTML, replaceSrcs } from '../utils/iframe';

class FilingController {
  private filingService: FilingService;

  constructor() {
    const apiClient = new SecEdgarApi();
    this.filingService = new FilingService(apiClient);
  }

  getLastDocuments = async (req: Request, res: Response) => {
    try {
      const filings = await this.filingService.getLastDocuments(req.params.id);

      if (filings) {
        res.status(200).json(filings);
      } else {
        res.status(404).json({ error: 'No filings found' });
      }
    } catch (error) {
      console.error('Error fetching filings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getFilingHTML = async (req: Request, res: Response) => {
    try {
      const url = req.query.url as string;

      if (!url) {
        res.status(400).json({ error: 'URL query parameter is required' });
      }

      const response = await fetch(url);
      let html = addScriptsToHTML(await response.text(), url);
      html = replaceSrcs(html, url);

      res.send(html);
    } catch (error) {
      console.error('Error fetching filing HTML:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export default FilingController;
