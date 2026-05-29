/**
 * NovusTools - Vanilla JS Compound Interest Calculator Logic
 * Calculates investment growth including inflation adjustments and step-up contributions.
 */

function calculateCompoundGrowth(initialDeposit, monthlyContribution, annualRate, years, compoundFrequency = 12, inflationRate = 0, stepUpRate = 0) {
    const P = initialDeposit;
    let currentMonthlyPMT = monthlyContribution;
    const r = annualRate / 100;
    const t = years;
    const n = compoundFrequency;
    const inf = inflationRate / 100;
    const step = stepUpRate / 100;

    let currentBalance = P;
    let totalInvested = P;
    
    let milestone100k = -1;
    let milestone1m = -1;
    
    const yearlyData = [];

    for (let year = 0; year <= t; year++) {
        if (year === 0) {
            yearlyData.push({
                year: 0,
                realInvested: P,
                realInterest: 0,
                realBalance: P
            });
            continue;
        }

        // Calculate compounding for the periods in the current year
        for (let period = 1; period <= n; period++) {
            currentBalance *= (1 + r / n);
            let periodContribution = currentMonthlyPMT * (12 / n);
            currentBalance += periodContribution;
            totalInvested += periodContribution;
        }

        // Adjust for inflation (Real Purchasing Power)
        const inflationFactor = Math.pow(1 + inf, year);
        const realInv = totalInvested / inflationFactor;
        const realBal = currentBalance / inflationFactor;
        const realInt = realBal - realInv;

        // Track Milestones based on Real Balance
        if (realBal >= 100000 && milestone100k === -1) milestone100k = year;
        if (realBal >= 1000000 && milestone1m === -1) milestone1m = year;

        yearlyData.push({
            year: year,
            realInvested: realInv,
            realInterest: realInt,
            realBalance: realBal
        });

        // Apply annual step-up to contributions
        currentMonthlyPMT *= (1 + step);
    }

    const finalYear = yearlyData[yearlyData.length - 1];

    return {
        finalRealBalance: finalYear.realBalance,
        totalRealInvested: finalYear.realInvested,
        totalRealInterest: finalYear.realInterest,
        milestones: {
            first100kYear: milestone100k > 0 ? milestone100k : null,
            first1MillionYear: milestone1m > 0 ? milestone1m : null
        },
        yearlyBreakdown: yearlyData
    };
}

// Example Usage:
// const growth = calculateCompoundGrowth(10000, 500, 8, 30, 12, 3, 2);
// console.log(growth);
