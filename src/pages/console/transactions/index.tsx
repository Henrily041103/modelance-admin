import { useQuery } from "@tanstack/react-query";
import {
  handleGetBank,
  handleGetRenewals,
  handleGetTable,
  handleGetUsers,
} from "./functions";
import useLogin from "@/hooks/useLogin";
import { getColumns } from "./tableRow";
import "./index.css";
import { DataTable } from "@/components/ui/fullTable";
import { useState } from "react";
import { Transaction } from "@/types/transactions";

export default function TransactionPage() {
  const { axios } = useLogin();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const tableData = useQuery({
    queryKey: ["transactions", selectedType],
    queryFn: async () => {
      const result = await handleGetTable(axios, selectedType);
      return result;
    },
  });

  const userData = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await handleGetUsers(axios);
      return result;
    },
  });

  const bankData = useQuery({
    queryKey: ["bank"],
    queryFn: async () => {
      const result = await handleGetBank(axios);
      return result;
    },
  });

  const renewalData = useQuery({
    queryKey: ["renewal"],
    queryFn: async () => {
      const result = await handleGetRenewals(axios);
      return result;
    },
  });

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4 flex justify-end">
        <button
          className={`mr-2 rounded-md px-4 py-2 ${
            selectedType === null
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleTypeFilter(null)}
        >
          All
        </button>
        <button
          className={`mr-2 rounded-md px-4 py-2 ${
            selectedType === "wallet"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleTypeFilter("wallet")}
        >
          Premium
        </button>
        <button
          className={`mr-2 rounded-md px-4 py-2 ${
            selectedType === "bank"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleTypeFilter("bank")}
        >
          Bank
        </button>
        {/* <button
          className={`mr-2 rounded-md px-4 py-2 ${
            selectedType === "premium"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleTypeFilter("premium")}
        >
          Premium
        </button> */}
      </div>
      {tableData.data && userData.data && bankData.data && renewalData.data && (
        <DataTable
          columns={getColumns(userData.data, bankData.data, renewalData.data)}
          data={tableData.data.transactions.filter((transaction: Transaction) => {
            if (selectedType === null) {
              return true;
            }
            if (selectedType === "wallet" && !transaction.wallet) {
              return false;
            }
            if (selectedType === "bank" && !transaction.bank) {
              return false;
            }
            if (selectedType === "premium" && !renewalData.data[transaction.id]) {
              return false;
            }
            return true;
          })}
        />
      )}
    </div>
  );
}
