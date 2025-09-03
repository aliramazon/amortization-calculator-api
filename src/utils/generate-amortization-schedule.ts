type ScheduleEntry = {
    month: number;
    date: string;
    startingBalance: number;
    interestPayment: number;
    principalPayment: number;
    endingBalance: number;
};

type AmortizationScheduleResult = {
    schedule: ScheduleEntry[];
    totalInterest: number;
    totalPrincipal: number;
    totalPayments: number;
};

export function generateAmortizationSchedule(
    loanAmount: number,
    amortizationMonths: number,
    termMonths: number,
    marginAbovePrime: number,
    primeInterestRate: number,
    startDate: Date = new Date(),
): AmortizationScheduleResult {
    const schedule: ScheduleEntry[] = [];
    const dailyInterestRate =
        (primeInterestRate + marginAbovePrime) / 100 / 360;
    const fixedPrincipalPayment = loanAmount / amortizationMonths;

    let balance = loanAmount;

    let totalInterest = 0;
    let totalPrincipal = 0;

    for (let month = 1; month <= termMonths; month++) {
        const payDate = new Date(startDate);
        payDate.setMonth(payDate.getMonth() + (month - 1));

        const endOfMonth = new Date(
            payDate.getFullYear(),
            payDate.getMonth() + 1,
            0,
        );

        const daysInMonth = endOfMonth.getDate();
        console.log(daysInMonth);

        const interestPayment = balance * dailyInterestRate * daysInMonth;
        // let principalPayment =
        //     month <= amortizationMonths ? fixedPrincipalPayment : 0; As terms is always less than amortization, we dont have to check the condition.
        let principalPayment = fixedPrincipalPayment;

        const endingBalance = balance - principalPayment;

        totalInterest += interestPayment;
        totalPrincipal += principalPayment;

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

        totalPrincipal += balance; // add balloon principal
    }

    const totalPayments = totalInterest + totalPrincipal;

    return {
        schedule,
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalPrincipal: parseFloat(totalPrincipal.toFixed(2)),
        totalPayments: parseFloat(totalPayments.toFixed(2)),
    };
}
