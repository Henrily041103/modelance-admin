import { Account, StatusType } from "@/types/general";
import {
  Pack,
  PackListResponse,
  PackPurchase,
  RenewalListResponse,
} from "@/types/premium";
import { AxiosInstance, AxiosResponse } from "axios";

export const handleGetUsers = async (axios: AxiosInstance) => {
  const responses = await axios.get<Account[], AxiosResponse<Account[]>>(
    "/admin/users"
  );
  const result = responses.data;

  return result;
};

export const handleGetPacks = async (axios: AxiosInstance) => {
  const responses = await axios.get<
    PackListResponse,
    AxiosResponse<PackListResponse>
  >("/admin/premium");
  const result = responses.data;

  const bankMap: Record<string, Pack> = {};

  for (const a of result.packs) {
    bankMap[a.role.id] = a;
  }
  console.log(bankMap)

  return bankMap;
};

export const handleGetRenewals = async (axios: AxiosInstance) => {
  const responses = await axios.get<
    RenewalListResponse,
    AxiosResponse<RenewalListResponse>
  >("/admin/premium/renewals");
  const result = responses.data;

  const bankMap: Record<string, PackPurchase[]> = {};

  for (const a of result.packs) {
    if (!bankMap[a.account.id]) {
      bankMap[a.account.id] = [];
    }
    bankMap[a.account.id].push(a);
  }

  return bankMap;
};

export const handleToggleAccount = async (
  axios: AxiosInstance,
  id: string,
  currentStatus: StatusType,
  handleToast: (message: string) => void
) => {
  const toggleString =
    currentStatus.statusName.toLowerCase() === "active" ? "ban" : "unban";
  const responses = await axios.put<string, AxiosResponse<string>>(
    `/admin/users/${id}/${toggleString}`
  );
  const result = responses.data;
  handleToast(result);
};
