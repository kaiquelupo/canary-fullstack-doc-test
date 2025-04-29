import { Router } from 'express';
import companiesRouter from './companies';

const apiRouter = Router();

apiRouter.use('/companies', companiesRouter);

export default apiRouter;
