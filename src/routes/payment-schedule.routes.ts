import { Router } from 'express';
import { paymentScheduleController } from '../controllers/payment-schedule.controller';

const paymentScheduleRouter = Router();

paymentScheduleRouter.get(
    '/amortization-schedule',
    paymentScheduleController.getAmortizationSchedule,
);

export { paymentScheduleRouter };
