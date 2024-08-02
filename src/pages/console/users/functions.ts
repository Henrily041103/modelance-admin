import { Account, StatusType } from "@/types/general";
import {
  Pack,
  PackListResponse,
  PackPurchase,
  RenewalListResponse,
} from "@/types/premium";
import { AxiosInstance, AxiosResponse } from "axios";

export const handleGetUsers = async (axios: AxiosInstance, status?: StatusType, role?: string) => {
  const url = "/admin/users";
  const params: { [key: string]: string } = {};
  if (status) {
    params.status = status.statusName.toLowerCase();
  }
  if (role) {
    params.role = role.toLowerCase();
  }
  const responses = await axios.get<Account[], AxiosResponse<Account[]>>(
    url,
    { params }
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

  const packMap: Record<string, Pack> = {};

  for (const pack of result.packs) {
    packMap[pack.role.id] = pack;
  }

  return packMap;
};

export const handleGetRenewals = async (axios: AxiosInstance) => {
  const responses = await axios.get<
    RenewalListResponse,
    AxiosResponse<RenewalListResponse>
  >("/admin/premium/renewals");
  const result = responses.data;

  const renewalMap: Record<string, PackPurchase[]> = {};

  for (const purchase of result.packs) {
    if (!renewalMap[purchase.account.id]) {
      renewalMap[purchase.account.id] = [];
    }
    renewalMap[purchase.account.id].push(purchase);
  }

  return renewalMap;
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
