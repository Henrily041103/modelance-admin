import {
  PremiumPackageChartDisplay,
  PremiumPackageComparisonChartData,
  PremiumPackagePurchaseChartData,
  RevenueGrowthChartData,
  UserGrowthChartData,
} from "@/types/charts";
import { Account } from "@/types/general";
import {
  Pack,
  PackListResponse,
  PackPurchase,
  RenewalListResponse,
} from "@/types/premium";
import {
  BankTransaction,
  BankTransactionListResponse,
  Transaction,
  TransactionListResponse,
} from "@/types/transactions";
import { AxiosInstance, AxiosResponse } from "axios";

function getDifferenceInDays(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day
  const diffInTime = date2.getTime() - date1.getTime(); // Difference in milliseconds
  return Math.round(diffInTime / oneDay); // Difference in days
}

export const handleGetTransactions = async (axios: AxiosInstance) => {
  const responses = await axios.get<
    TransactionListResponse,
    AxiosResponse<TransactionListResponse>
  >("/admin/transactions");
  const result = responses.data;
  result.transactions.sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    return dateB.getTime() - dateA.getTime();
  });

  const transactionMap: Record<string, Transaction> = {};

  for (const transaction of result.transactions) {
    transactionMap[transaction.id] = transaction;
  }

  return transactionMap;
};

export const handleGetPacks = async (axios: AxiosInstance) => {
  const responses = await axios.get<
    PackListResponse,
    AxiosResponse<PackListResponse>
  >("/admin/premium");
  const result = responses.data;
  const packMap: Record<string, Pack> = {};

  for (const pack of result.packs) {
    packMap[pack.role.id] = pack;
  }

  return packMap;
};

export const handleGetUsers = async (axios: AxiosInstance) => {
  const responses = await axios.get<Account[], AxiosResponse<Account[]>>(
    "/admin/users"
  );
  const result = responses.data;

  return result;
};

export const handleGetBank = async (axios: AxiosInstance) => {
  const responses = await axios.get<
    BankTransactionListResponse,
    AxiosResponse<BankTransactionListResponse>
  >("/admin/transactions/bank");
  const result = responses.data;

  const bankMap: Record<string, BankTransaction> = {};

  for (const a of result.transactions) {
    bankMap[a.orderCode] = a;
  }

  return bankMap;
};

export const handleGetRenewals = async (axios: AxiosInstance) => {
  const responses = await axios.get<
    RenewalListResponse,
    AxiosResponse<RenewalListResponse>
  >("/admin/premium/renewals");
  const result = responses.data;

  const renewalMap: Record<string, PackPurchase> = {};

  for (const a of result.packs) {
    renewalMap[a.id] = a;
  }

  return renewalMap;
};

export const prepareRevenueChartDataByDay = (
  transactionMap: Record<string, Transaction>,
  renewalMap: Record<string, PackPurchase>
) => {
  const chartMap: Record<string, number | undefined> = {};
  for (const renewalId in renewalMap) {
    const transaction = transactionMap[renewalId];
    if (transaction) {
      const transactionTime = new Date(transaction.datetime);
      const transactionDateString =
        transactionTime.getFullYear() +
        "/" +
        (transactionTime.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        transactionTime.getDate().toString().padStart(2, "0");
      let chartDatum = chartMap[transactionDateString];
      if (chartDatum) {
        chartDatum += -transaction.amount;
        chartMap[transactionDateString] = chartDatum;
      } else {
        chartMap[transactionDateString] = -transaction.amount;
      }
    }
  }

  const chartData: RevenueGrowthChartData[] = [];
  for (const dateString in chartMap) {
    chartData.push({
      date: dateString,
      premium: chartMap[dateString] ? chartMap[dateString] : 0,
      job: 0,
    });
  }

  chartData.sort((a, b) => a.date.localeCompare(b.date));

  return chartData;
};

export const prepareRevenueChartDataByMonth = (
  transactionMap: Record<string, Transaction>,
  renewalMap: Record<string, PackPurchase>
) => {
  const chartMap: Record<string, number | undefined> = {};
  for (const renewalId in renewalMap) {
    const transaction = transactionMap[renewalId];
    if (transaction) {
      const transactionTime = new Date(transaction.datetime);
      const transactionDateString =
        transactionTime.getFullYear() +
        "/" +
        (transactionTime.getMonth() + 1).toString().padStart(2, "0");
      let chartDatum = chartMap[transactionDateString];
      if (chartDatum) {
        chartDatum += -transaction.amount;
        chartMap[transactionDateString] = chartDatum;
      } else {
        chartMap[transactionDateString] = -transaction.amount;
      }
    }
  }

  const chartData: RevenueGrowthChartData[] = [];
  for (const dateString in chartMap) {
    chartData.push({
      date: dateString,
      premium: chartMap[dateString] ? chartMap[dateString] : 0,
      job: 0,
    });
  }

  chartData.sort((a, b) => a.date.localeCompare(b.date));

  return chartData;
};

export const handleCreateRevChart = (
  transactionData: Record<string, Transaction> | undefined,
  renewalData: Record<string, PackPurchase> | undefined,
  revChartMode: "Daily" | "Monthly",
  setRevenueChartData: (data: RevenueGrowthChartData[]) => void
) => {
  if (transactionData && renewalData) {
    const prepFunc =
      revChartMode === "Daily"
        ? prepareRevenueChartDataByDay
        : prepareRevenueChartDataByMonth;
    const data = prepFunc(transactionData, renewalData);
    setRevenueChartData(data);
  }
};

export const handleCreatePremiumPackChart = (
  packData: Record<string, Pack> | undefined,
  renewalData: Record<string, PackPurchase> | undefined,
  accountData: Account[] | undefined
) => {
  const renewalObject: Record<string, PackPurchase> = {};

  for (const renewalKey in renewalData) {
    const renewalDatum = renewalData[renewalKey];
    if (renewalDatum) {
      const diff =
        getDifferenceInDays(new Date(renewalDatum.renewalDate), new Date()) <
        30;
      if (diff) renewalObject[renewalDatum.account.id] = renewalDatum;
    }
  }

  let employerCount = 0;
  let modelCount = 0;
  if (accountData) {
    for (const account of accountData) {
      if (
        account.role.roleName.toLowerCase() === "model" &&
        account.status.statusName === "active"
      ) {
        modelCount++;
      } else if (
        account.role.roleName.toLowerCase() === "employer" &&
        account.status.statusName === "active"
      ) {
        employerCount++;
      }
    }
  }

  const employerPack = packData ? packData["3"] : undefined;
  const modelPack = packData ? packData["3"] : undefined;
  let employerData: PremiumPackagePurchaseChartData = {
    packName: "",
    packId: "",
    purchases: 0,
    remaining: 0,
    roleName: "",
  };
  let modelData: PremiumPackagePurchaseChartData = {
    packName: "",
    packId: "",
    purchases: 0,
    remaining: 0,
    roleName: "",
  };
  if (employerPack) {
    employerData = {
      packName: employerPack?.packName,
      packId: employerPack.id,
      purchases: 0,
      roleName: "Employer",
      remaining: employerCount,
    };
  }

  if (modelPack) {
    modelData = {
      packName: modelPack.packName,
      packId: modelPack.id,
      purchases: 0,
      roleName: "Employer",
      remaining: modelCount,
    };
  }

  let compareData: PremiumPackageComparisonChartData = {
    employerPurchase: 0,
    modelPurchase: 0,
    noPurchase: 0,
  };

  if (accountData) {
    // 2 role charts
    const renewedAccountList: Account[] = accountData
      .map((value) => (renewalObject[value.id] ? value : undefined))
      .filter((value) => value !== null && value !== undefined);

    for (const account of renewedAccountList) {
      if (
        account.role.roleName.toLowerCase() === "model" &&
        account.status.statusName === "active" &&
        modelData != undefined
      ) {
        modelData.purchases++;
        modelData.remaining--;
      } else if (
        account.role.roleName.toLowerCase() === "employer" &&
        account.status.statusName === "active" &&
        employerData != undefined
      ) {
        employerData.purchases++;
        employerData.remaining--;
      }
    }

    // general comparison chart
    compareData = {
      employerPurchase: employerData.purchases,
      modelPurchase: modelData.purchases,
      noPurchase:
        accountData.length - employerData.purchases - modelData.purchases,
    };
  }

  return {
    employer: employerData,
    model: modelData,
    comparison: compareData,
  };
};

export const handlePremPurchaseDisplay = (
  premPurchase: PremiumPackagePurchaseChartData
) => {
  const displayData: PremiumPackageChartDisplay[] = [
    {
      name: "active",
      amount: premPurchase.purchases,
      fill: "#2563eb",
    },
    {
      name: "inactive",
      amount: premPurchase.remaining,
      fill: "#DA9C14",
    },
  ];

  return displayData;
};

export const handlePremCompareDisplay = (
  premPurchase: PremiumPackageComparisonChartData
) => {
  const displayData: PremiumPackageChartDisplay[] = [
    {
      name: "employer",
      amount: premPurchase.employerPurchase,
      fill: "#EB259C",
    },
    {
      name: "model",
      amount: premPurchase.modelPurchase,
      fill: "#2563eb",
    },
    {
      name: "none",
      amount: premPurchase.noPurchase,
      fill: "#DA9C14",
    },
  ];

  return displayData;
};

export const prepareUserChartDataByDay = (
  accountData: Account[] | undefined
) => {
  const chartMap: Record<string, UserGrowthChartData | undefined> = {};
  if (accountData) {
    for (const account of accountData) {
      const accountCreateTime = new Date(account.createDate);
      const accountDateString =
        accountCreateTime.getFullYear() +
        "/" +
        (accountCreateTime.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        accountCreateTime.getDate().toString().padStart(2, "0");
      if (chartMap[accountDateString]) {
        chartMap[accountDateString][
          account.role.roleName as "employer" | "model"
        ]++;
      } else {
        chartMap[accountDateString] = {
          date: accountDateString,
          employer: 0,
          model: 0,
        };
        chartMap[accountDateString][
          account.role.roleName as "employer" | "model"
        ]++;
      }
    }
  }

  const chartData: UserGrowthChartData[] = [];
  for (const dateString in chartMap) {
    chartData.push(chartMap[dateString]!);
  }

  chartData.sort((a, b) => a.date.localeCompare(b.date));

  return chartData;
};

export const prepareUserChartDataByMonth = (
  accountData: Account[] | undefined
) => {
  const chartMap: Record<string, UserGrowthChartData | undefined> = {};
  if (accountData) {
    for (const account of accountData) {
      const accountCreateTime = new Date(account.createDate);
      const accountDateString =
        accountCreateTime.getFullYear() +
        "/" +
        (accountCreateTime.getMonth() + 1).toString().padStart(2, "0");
      if (chartMap[accountDateString]) {
        chartMap[accountDateString][
          account.role.roleName as "employer" | "model"
        ]++;
      } else {
        chartMap[accountDateString] = {
          date: accountDateString,
          employer: 0,
          model: 0,
        };
        chartMap[accountDateString][
          account.role.roleName as "employer" | "model"
        ]++;
      }
    }
  }

  const chartData: UserGrowthChartData[] = [];
  for (const dateString in chartMap) {
    chartData.push(chartMap[dateString]!);
  }

  chartData.sort((a, b) => a.date.localeCompare(b.date));

  return chartData;
};

export const handleCreateUserChart = (
  accountData: Account[] | undefined,
  userChartMode: "Daily" | "Monthly",
  setUserChartData: (data: UserGrowthChartData[]) => void
) => {
  if (accountData) {
    const prepFunc =
      userChartMode === "Daily"
        ? prepareUserChartDataByDay
        : prepareUserChartDataByMonth;
    const data = prepFunc(accountData);
    setUserChartData(data);
  }
};
