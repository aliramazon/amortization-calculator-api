import { generateAmortizationSchedule } from '../utils/generate-amortization-schedule';

const getAmortizationSchedule = (
    loanAmount: string,
    amortizationMonths: string,
    termMonths: string,
    marginAbovePrime: string,
    primeInterestRate: string,
) => {
    const result = generateAmortizationSchedule(
        Number(loanAmount),
        Number(amortizationMonths),
        Number(termMonths),
        Number(marginAbovePrime),
        Number(primeInterestRate),
    );

    return result;
};

export const paymentScheduleService = {
    getAmortizationSchedule,
};
