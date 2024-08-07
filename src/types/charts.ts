export type RevenueGrowthChartData = {
  date: string; //yyyy/MM/dd
  premium: number;
  job: number;
};

export type PremiumPackagePurchaseChartData = {
  packName: string;
  packId: string;
  purchases: number;
  remaining: number;
  roleName: string;
};

export type PremiumPackageChartDisplay = {
  name: string,
  amount: number,
  fill: string
}

export type PremiumPackageComparisonChartData = {
  employerPurchase: number,
  modelPurchase: number,
  noPurchase: number
};

export type UserGrowthChartData = {
  date: string; //yyyy/MM/dd
  model: number;
  employer: number;
};
