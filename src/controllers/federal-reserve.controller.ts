import { Request, Response } from 'express';
import { federalReserveService } from '../services/federal-reserve.service';

interface SuccessResponse {
    success: true;
    data: {
        primeRate: number;
        effectiveDate: string;
        lastUpdated: string;
    };
    message: string;
}

interface ErrorResponse {
    success: false;
    error: string;
    message: string;
}

export const getPrimeInterestRate = async (
    _: Request,
    res: Response,
): Promise<void> => {
    try {
        const result = await federalReserveService.getPrimeInterestRate();

        if (result.success) {
            const response: SuccessResponse = {
                success: true,
                data: {
                    primeRate: result.rate,
                    effectiveDate: result.date,
                    lastUpdated: new Date().toISOString(),
                },
                message: 'Prime rate retrieved successfully',
            };

            res.status(200).json(response);
        } else {
            const response: ErrorResponse = {
                success: false,
                error: result.error,
                message: 'Failed to retrieve prime rate from Federal Reserve',
            };

            res.status(503).json(response);
        }
    } catch (error) {
        const response: ErrorResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'Internal server error while fetching prime rate',
        };

        res.status(500).json(response);
    }
};

export const federalReserveController = {
    getPrimeInterestRate,
};
