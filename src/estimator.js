const covid19ImpactEstimator = (data) => {
  const {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds
  } = data;

  const impact = { };
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

  impact.severeCasesByRequestedTime = ((15 / 100) * impact.infectionsByRequestedTime);
  severeImpact.severeCasesByRequestedTime = (
    (15 / 100) * severeImpact.infectionsByRequestedTime
  );

  impact.hospitalBedsByRequestedTime = Math.trunc(
    ((35 / 100) * totalHospitalBeds) - impact.severeCasesByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    ((35 / 100) * totalHospitalBeds) - severeImpact.severeCasesByRequestedTime
  );

  impact.casesForICUByRequestedTime = Math.trunc((5 / 100) * impact.infectionsByRequestedTime);
  severeImpact.casesForICUByRequestedTime = Math.trunc(
    (5 / 100) * severeImpact.infectionsByRequestedTime
  );

  impact.casesForVentilatorsByRequestedTime = Math.trunc(
    (0.02) * impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    (0.02) * severeImpact.infectionsByRequestedTime
  );

  impact.dollarsInFlight = Math.trunc(
    (impact.infectionsByRequestedTime * region.avgDailyIncomeInUSD
     * region.avgDailyIncomePopulation) / computedTimeToElapse
  );
  severeImpact.dollarsInFlight = Math.trunc(
    (severeImpact.infectionsByRequestedTime * region.avgDailyIncomeInUSD
     * region.avgDailyIncomePopulation) / computedTimeToElapse
  );
  return {
    data,
    impact,
    severeImpact
  };
};

module.exports = covid19ImpactEstimator;
