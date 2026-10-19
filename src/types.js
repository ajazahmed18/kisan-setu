export function calculateCommissions(finalProduceValue) {
  const fpoCommission = Math.round(finalProduceValue * 0.015 * 100) / 100;
  const platformCommission = Math.round(finalProduceValue * 0.01 * 100) / 100;
  const sellerPayout = Math.round((finalProduceValue - fpoCommission - platformCommission) * 100) / 100;

  return {
    finalProduceValue,
    sellerPayout,
    fpoCommission,
    platformCommission,
    sellerPayoutPercentage: 97.5,
    fpoCommissionPercentage: 1.5,
    platformCommissionPercentage: 1,
  };
}

export default {
  calculateCommissions,
};
