import { useQuery } from "@tanstack/react-query";
import {
  handleCreatePremiumPackChart,
  handleCreateRevChart,
  handleCreateUserChart,
  handleGetPacks,
  handleGetRenewals,
  handleGetTransactions,
  handleGetUsers,
  handlePremCompareDisplay,
  handlePremPurchaseDisplay,
} from "./functions";
import useLogin from "@/hooks/useLogin";
import { useEffect, useState } from "react";
import {
  PremiumPackageComparisonChartData,
  PremiumPackagePurchaseChartData,
  RevenueGrowthChartData,
  UserGrowthChartData,
} from "@/types/charts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

const getFormattedNumber = (num: number) => {
  const format = Intl.NumberFormat("vi");
  return format.format(num);
};

export default function StatisticsPage() {
  const { axios } = useLogin();

  const [revenueChartData, setRevenueChartData] =
    useState<RevenueGrowthChartData[]>();
  const [premPurchaseData, setPremPurchaseData] =
    useState<PremiumPackagePurchaseChartData[]>();
  const [premCompareData, setPremCompareData] =
    useState<PremiumPackageComparisonChartData>();
  const [userChartData, setUserChartData] = useState<UserGrowthChartData[]>();
  const [revChartMode, setRevChartMode] = useState<"Daily" | "Monthly">(
    "Daily"
  );
  const [userChartMode, setUserChartMode] = useState<"Daily" | "Monthly">(
    "Daily"
  );

  const transactionData = useQuery({
    queryKey: ["transactionsStat"],
    queryFn: async () => {
      const result = await handleGetTransactions(axios);
      return result;
    },
  });

  const renewalData = useQuery({
    queryKey: ["renewalStat"],
    queryFn: async () => {
      const result = await handleGetRenewals(axios);
      return result;
    },
  });

  const packData = useQuery({
    queryKey: ["packStat"],
    queryFn: async () => {
      const result = await handleGetPacks(axios);
      return result;
    },
  });

  const userData = useQuery({
    queryKey: ["usersStat"],
    queryFn: async () => {
      const result = await handleGetUsers(axios);
      return result;
    },
  });

  useEffect(() => {
    handleCreateRevChart(
      transactionData.data,
      renewalData.data,
      revChartMode,
      setRevenueChartData
    );

    const { employer, model, comparison } = handleCreatePremiumPackChart(
      packData.data,
      renewalData.data,
      userData.data
    );
    setPremPurchaseData([employer, model]);
    setPremCompareData(comparison);

    handleCreateUserChart(userData.data, userChartMode, setUserChartData);
  }, [
    transactionData.data,
    renewalData.data,
    revChartMode,
    packData.data,
    userData.data,
    userChartMode,
  ]);

  const revenueChartConfig = {
    premium: {
      label: "Premium Revenue",
      color: "#2563eb",
    },
    job: {
      label: "Job Commission Revenue",
      color: "#DA9C14",
    },
  } satisfies ChartConfig;

  const premiumEmployerConfig = {
    active: {
      label: "Employers with renewed premium package",
      color: "#2563eb",
    },
    inactive: {
      label: "Employer without renewed premium package",
      color: "#DA9C14",
    },
  } satisfies ChartConfig;
  const premiumModelConfig = {
    active: {
      label: "Models with renewed premium package",
      color: "#2563eb",
    },
    inactive: {
      label: "Models without renewed premium package",
      color: "#DA9C14",
    },
  } satisfies ChartConfig;

  const premiumCompareConfig = {
    model: {
      label: "Models with renewed premium package",
      color: "#2563eb",
    },
    employer: {
      label: "Employers with renewed premium package",
      color: "#EB259C",
    },
    none: {
      label: "Accounts without renewed premium package",
      color: "#DA9C14",
    },
  } satisfies ChartConfig;

  const userChartConfig = {
    employer: {
      label: "Employer count",
      color: "#2563eb",
    },
    model: {
      label: "Model count",
      color: "#DA9C14",
    },
  } satisfies ChartConfig;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-row">
        <div className="flex flex-col gap-14 w-[40vw]">
          <div className="text-center font-semibold">REVENUE GROWTH</div>
          <div className="mb-4 flex justify-start">
            <button
              className={`mr-2 rounded-md px-4 py-2 ${
                revChartMode === "Daily"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setRevChartMode("Daily");
                handleCreateRevChart(
                  transactionData.data,
                  renewalData.data,
                  "Daily",
                  setRevenueChartData
                );
              }}
            >
              Daily
            </button>
            <button
              className={`mr-2 rounded-md px-4 py-2 ${
                revChartMode === "Monthly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setRevChartMode("Monthly");
                handleCreateRevChart(
                  transactionData.data,
                  renewalData.data,
                  "Monthly",
                  setRevenueChartData
                );
              }}
            >
              Monthly
            </button>
          </div>
          <div className="flex flex-col justify-center">
            {transactionData.data && renewalData.data && (
              <ChartContainer
                config={revenueChartConfig}
                className="min-h-[200px] w-[30vw]"
              >
                <AreaChart
                  accessibilityLayer
                  data={revenueChartData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 10,
                    bottom: 10,
                  }}
                >
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickMargin={10}
                    tickFormatter={(value) => {
                      if (revChartMode === "Daily") {
                        const [year, month, day] = value.split("/");
                        return `${day}/${month}/${year.slice(2, 4)}`;
                      } else {
                        const [year, month] = value.split("/");
                        return `${month}/${year.slice(2, 4)}`;
                      }
                    }}
                  />
                  <YAxis tickFormatter={(value) => getFormattedNumber(value)} />

                  <Area
                    dataKey="premium"
                    type="natural"
                    fill="#2563eb"
                    fillOpacity={0.4}
                    stroke="#2563eb"
                    stackId="a"
                  />
                  <Area
                    dataKey="job"
                    type="natural"
                    fill="#DA9C14"
                    fillOpacity={0.4}
                    stroke="#DA9C14"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-14 w-[40vw]">
          <div className="text-center font-semibold">
            PREMIUM PURCHASE RATES
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-row justify-center align-center">
              <div className="max-w-[20vw]">
                {premPurchaseData && (
                  <div className="flex flex-col justify-center">
                    <div className="text-center font-semibold">EMPLOYER</div>
                    <div>
                      <ChartContainer
                        config={premiumEmployerConfig}
                        className="min-h-[200px] w-[20vw]"
                      >
                        <PieChart>
                          <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={handlePremPurchaseDisplay(
                              premPurchaseData[0]
                            )}
                            dataKey="amount"
                            label
                            nameKey="name"
                          />
                        </PieChart>
                      </ChartContainer>
                    </div>
                  </div>
                )}
              </div>
              <div className="max-w-[20vw]">
                {premPurchaseData && (
                  <div className="flex flex-col justify-center">
                    <div className="text-center font-semibold">MODEL</div>
                    <ChartContainer
                      config={premiumModelConfig}
                      className="min-h-[200px] w-[20vw]"
                    >
                      <PieChart>
                        <ChartTooltip
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={handlePremPurchaseDisplay(premPurchaseData[1])}
                          dataKey="amount"
                          label
                          nameKey="name"
                        />
                      </PieChart>
                    </ChartContainer>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center align-center">
              <div className="font-semibold">PREMIUM ACQUISITION RATE</div>
              {premCompareData && (
                <div className="justify-center align-center text-center">
                  <ChartContainer
                    config={premiumCompareConfig}
                    className="min-h-[200px] w-[30vw]"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={handlePremCompareDisplay(premCompareData)}
                        dataKey="amount"
                        label
                        nameKey="name"
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-14 w-[80vw]">
        <div className="text-center font-semibold">USER GROWTH</div>
        <div className="mb-4 flex justify-start">
          <button
            className={`mr-2 rounded-md px-4 py-2 ${
              userChartMode === "Daily"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => {
              setUserChartMode("Daily");
              handleCreateUserChart(userData.data, "Daily", setUserChartData);
            }}
          >
            Daily
          </button>
          <button
            className={`mr-2 rounded-md px-4 py-2 ${
              userChartMode === "Monthly"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => {
              setUserChartMode("Monthly");
              handleCreateUserChart(userData.data, "Monthly", setUserChartData);
            }}
          >
            Monthly
          </button>
        </div>
        <div className="flex flex-col justify-center">
          {userData.data && (
            <ChartContainer
              config={userChartConfig}
              className="min-h-[200px] w-[60vw]"
            >
              <LineChart
                accessibilityLayer
                data={userChartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 10,
                  bottom: 10,
                }}
              >
                <ChartTooltip content={<ChartTooltipContent />} />
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickMargin={10}
                  tickFormatter={(value) => {
                    if (userChartMode === "Daily") {
                      const [year, month, day] = value.split("/");
                      return `${day}/${month}/${year.slice(2, 4)}`;
                    } else {
                      const [year, month] = value.split("/");
                      return `${month}/${year.slice(2, 4)}`;
                    }
                  }}
                />
                <YAxis tickFormatter={(value) => getFormattedNumber(value)} />
                <Line
                  dataKey="model"
                  type="monotone"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={true}
                />
                <Line
                  dataKey="employer"
                  type="monotone"
                  stroke="#DA9C14"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          )}
        </div>
      </div>
    </div>
  );
}
