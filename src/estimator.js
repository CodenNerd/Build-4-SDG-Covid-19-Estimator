const covid19ImpactEstimator = (data) => {
  const {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds
  } = data;

  const impact = {};
  const severeImpact = {};
  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;
  let computedTimeToElapse = timeToElapse;
  if (periodType === 'weeks') computedTimeToElapse = timeToElapse * 7;
  if (periodType === 'months') computedTimeToElapse = timeToElapse * 30;

  impact.infectionsByRequestedTime = (
    impact.currentlyInfected * (2 ** (Math.floor(computedTimeToElapse / 3)))
  );
  severeImpact.infectionsByRequestedTime = (
    severeImpact.currentlyInfected * (2 ** ((Math.floor(computedTimeToElapse / 3))))
  );

  impact.severeCasesByRequestedTime = Math.floor((15 / 100) * impact.infectionsByRequestedTime);
  severeImpact.severeCasesByRequestedTime = Math.floor(
    (15 / 100) * severeImpact.infectionsByRequestedTime
  );

  impact.hospitalBedsByRequestedTime = Math.floor(
    Math.floor((35 / 100) * totalHospitalBeds) - impact.severeCasesByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = Math.floor(
    Math.floor((35 / 100) * totalHospitalBeds) - severeImpact.severeCasesByRequestedTime
  );

  impact.casesForICUByRequestedTime = (5 / 100) * impact.infectionsByRequestedTime;
  severeImpact.casesForICUByRequestedTime = (5 / 100) * severeImpact.infectionsByRequestedTime;

  impact.casesForVentilatorsByRequestedTime = (2 / 100) * impact.infectionsByRequestedTime;
  severeImpact.casesForVentilatorsByRequestedTime = (
    (2 / 100) * severeImpact.infectionsByRequestedTime
  );

  impact.dollarsInFlight = (
    impact.infectionsByRequestedTime * region.avgDailyIncomeInUSD
     * region.avgDailyIncomePopulation * computedTimeToElapse
  );
  severeImpact.dollarsInFlight = (
    severeImpact.infectionsByRequestedTime * region.avgDailyIncomeInUSD
     * region.avgDailyIncomePopulation * computedTimeToElapse
  );
  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
