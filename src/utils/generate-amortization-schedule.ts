type ScheduleEntry = {
    month: number;
    date: string;
    startingBalance: number;
    interestPayment: number;
    principalPayment: number;
    endingBalance: number;
};

export function generateAmortizationSchedule(
    loanAmount: number,
    amortizationMonths: number,
    termMonths: number,
    marginAbovePrime: number,
    primeInterestRate: number,
    startDate: Date = new Date(),
) {
    const schedule: ScheduleEntry[] = [];
    const dailyInterestRate =
        (primeInterestRate + marginAbovePrime) / 100 / 360;
    const fixedPrincipalPayment = loanAmount / amortizationMonths;

    let balance = loanAmount;

    for (let month = 1; month <= termMonths; month++) {
        const payDate = new Date(startDate);
        payDate.setMonth(payDate.getMonth() + month);

        const endOfMonth = new Date(
            payDate.getFullYear(),
            payDate.getMonth() + 1,
            0,
        );

        const daysInMonth = endOfMonth.getDate();

        const interestPayment = balance * dailyInterestRate * daysInMonth;

        let principalPayment =
            month <= amortizationMonths ? fixedPrincipalPayment : 0;

        const endingBalance = balance - principalPayment;

        schedule.push({
            month,
            date: endOfMonth.toISOString().split('T')[0],
            startingBalance: parseFloat(balance.toFixed(2)),
            interestPayment: parseFloat(interestPayment.toFixed(2)),
            principalPayment: parseFloat(principalPayment.toFixed(2)),
            endingBalance: parseFloat(endingBalance.toFixed(2)),
        });

        balance = endingBalance;
    }

    if (balance > 0) {
        const lastPaymentDate = new Date(startDate);
        lastPaymentDate.setMonth(lastPaymentDate.getMonth() + termMonths);
        const balloonDate = new Date(
            lastPaymentDate.getFullYear(),
            lastPaymentDate.getMonth() + 1,
            1,
        );

        schedule.push({
            month: termMonths + 1,
            date: balloonDate.toISOString().split('T')[0],
            startingBalance: parseFloat(balance.toFixed(2)),
            interestPayment: 0,
            principalPayment: parseFloat(balance.toFixed(2)),
            endingBalance: 0,
        });
    }

    return schedule;
}
