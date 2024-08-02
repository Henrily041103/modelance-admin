import { Account } from "@/types/general";
import { PackPurchase, RenewalListResponse } from "@/types/premium";
import {
  BankTransaction,
  BankTransactionListResponse,
  TransactionListResponse,
} from "@/types/transactions";
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

export const handleGetUsers = async (axios: AxiosInstance) => {
  const responses = await axios.get<Account[], AxiosResponse<Account[]>>(
    "/admin/users"
  );
  const result = responses.data;

  const userMap: Record<string, Account> = {};

  for (const a of result) {
    userMap[a.id] = a;
  }

  return userMap;
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

  const bankMap: Record<string, PackPurchase> = {};

  console.log(result.packs)
  for (const a of result.packs) {
    bankMap[a.id] = a;
  }
  console.log(bankMap)

  return bankMap;
};
