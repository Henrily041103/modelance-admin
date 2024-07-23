import { BankTransaction, Transaction } from "@/types/transactions";
import { AxiosInstance, AxiosResponse } from "axios";

export const handleGetTable = async (axios: AxiosInstance) => {
  const responses = await axios.get<
    Transaction[],
    AxiosResponse<Transaction[]>
  >("/admin/transactions");
  const result = responses.data;
  return result;
};

export const handleGetBank = async (axios: AxiosInstance) => {
  const responses = await axios.get<
    BankTransaction[],
    AxiosResponse<BankTransaction[]>
  >("/admin/transactions/bank");
  const result = responses.data;
  return result;
};
