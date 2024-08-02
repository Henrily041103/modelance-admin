import { useQuery } from "@tanstack/react-query";
import { handleGetBank, handleGetTable, handleGetUsers } from "./functions";
import useLogin from "@/hooks/useLogin";
import { DataTable } from "./tableDefs";
import { getColumns } from "./tableRow";
import "./index.css";

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
      // console.log(result)`
      return result;
    },
  });

  return (
    <div className="container mx-auto py-10">
      {tableData.data && userData.data && bankData.data && (
        <DataTable
          columns={getColumns(userData.data, bankData.data)}
          data={tableData.data.transactions}
        />
      )}
    </div>
  );
}
