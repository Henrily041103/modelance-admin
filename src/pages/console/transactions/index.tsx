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

export default function TransactionPage() {
  const { axios } = useLogin();
  const tableData = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const result = await handleGetTable(axios);
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

  const packData = useQuery({
    queryKey: ["renewal"],
    queryFn: async () => {
      const result = await handleGetRenewals(axios);
      return result;
    },
  });

  return (
    <div className="container mx-auto py-10">
      {tableData.data && userData.data && bankData.data && packData.data && (
        <DataTable
          columns={getColumns(userData.data, bankData.data, packData.data)}
          data={tableData.data.transactions}
        />
      )}
    </div>
  );
}
