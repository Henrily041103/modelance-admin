import { TransactionListResponse } from "@/types/transactions";
import { AxiosInstance, AxiosResponse } from "axios";

export const handleGetTable = async (axios: AxiosInstance) => {
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
  return result;
};

// export const handleGetBank = async (axios: AxiosInstance) => {
//   const responses = await axios.get<
//     BankTransaction[],
//     AxiosResponse<BankTransaction[]>
//   >("/admin/transactions/bank");
//   const result = responses.data;
//   return result;
// };
