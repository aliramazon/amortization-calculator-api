import { Router } from 'express';
import { federalReserveController } from '../controllers/federal-reserve.controller';

const federalReserveRouter = Router();

federalReserveRouter.get(
    '/prime-interest-rate',
    federalReserveController.getPrimeInterestRate,
);

export { federalReserveRouter };
