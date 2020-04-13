const covid19ImpactEstimator = (data) => {
    const {region, periodType, timeToElapse, reportedCases, population, totalHospitalBeds} = data;
    const impact = {};
    const severeImpact = {};
    impact.currentlyInfected = reportedCases * 10;
    severeImpact.currentlyInfected = reportedCases * 50;
    if(periodType === "weeks") timeToElapse = timeToElapse * 7;
    if(periodType === "months") timeToElapse = timeToElapse * 30;
    impact.infectionsByRequestedTime = currentlyInfected * (2**((1/3)*timeToElapse))
    severeImpact.infectionsByRequestedTime = currentlyInfected * (2**((1/3)*timeToElapse))

    impact.severeCasesByRequestedTime = (15/100) * impact.infectionsByRequestedTime
    severeImpact.severeCasesByRequestedTime = (15/100) * severImpact.infectionsByRequestedTime

    impact.hospitalBedsByRequestedTime = ((35/100) * totalHospitalBeds) - impact.severeCasesByRequestedTime
    severeImpact.hospitalBedsByRequestedTime = ((35/100) * totalHospitalBeds) - severeImpact.severeCasesByRequestedTime

    impact.casesForICUByRequestedTime = (5/100) * impact.infectionsByRequestedTime
    severeImpact.casesForICUByRequestedTime = (5/100) * severeImpact.infectionsByRequestedTime

    impact.casesForVentilatorsByRequestedTime = (2/100) * impact.infectionsByRequestedTime
    severeImpact.casesForVentilatorsByRequestedTime = (2/100) * severeImpact.infectionsByRequestedTime

    impact.dollarsInFlight = impact.infectionsByRequestedTime * region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation * timeToElapse
    severeImpact.dollarsInFlight = severeImpact.infectionsByRequestedTime * region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation * timeToElapse

    return {
        data,
        impact,
        severeImpact
    }
};

export default covid19ImpactEstimator;
