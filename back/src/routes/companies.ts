import { Router } from 'express';
import FilingController from '../controlers/FilingController';

const companiesRouter = Router();

const filingController = new FilingController();

companiesRouter.get('/', (req, res) => {
  res.json([
    { id: '0000320193', name: 'Apple (AAPL)' },
    { id: '0000789019', name: 'Microsoft (MSFT)' },
    { id: '0001018724', name: 'Amazon (AMZN)' },
    { id: '0001652044', name: 'Alphabet (GOOGL)' },
    { id: '0001326801', name: 'Meta (META)' },
    { id: '0001318605', name: 'Tesla (TSLA)' },
    { id: '0001065280', name: 'Netflix (NFLX) ' },
  ]);
});

companiesRouter.get('/:id/lastDocuments/', filingController.getLastDocuments);

companiesRouter.get('/document', filingController.getFilingHTML);

export default companiesRouter;
