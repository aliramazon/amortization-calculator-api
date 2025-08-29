import { Request, Response } from 'express';
import { paymentScheduleService } from '../services/payment-schedule';

export const getAmortizationSchedule = (req: Request, res: Response) => {
    try {
        const {
            loanAmount,
            amortizationMonths,
            termMonths,
            marginAbovePrime,
            primeRate,
        } = req.query;

        if (
            loanAmount == null ||
            amortizationMonths == null ||
            termMonths == null ||
            marginAbovePrime == null ||
            primeRate == null
        ) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
            });
        }

        const result = paymentScheduleService.getAmortizationSchedule(
            loanAmount as string,
            amortizationMonths as string,
            termMonths as string,
            marginAbovePrime as string,
            primeRate as string,
        );

        return res.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

export const paymentScheduleController = {
    getAmortizationSchedule,
};
