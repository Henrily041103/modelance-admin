import { useQuery } from "@tanstack/react-query";
import { handleGetTable } from "./functions";
import useLogin from "@/hooks/useLogin";
import { DataTable } from "./tableDefs";
import { columns } from "./tableRow";
import "./index.css"

export default function TransactionPage() {
  const { axios } = useLogin();
  const tableData = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const result = await handleGetTable(axios);
      return result;
    },
  });
  //   const bankData = useQuery({
  //     queryKey: ["bank-transactions"],
  //     queryFn: async () => {
  //       const result = await handleGetBank(axios);
  //       return result;
  //     },
  //   });

  return (
    <div className="container mx-auto py-10">
      {tableData.data && <DataTable columns={columns} data={tableData.data} />}
    </div>
  );
}
