export type Pack = {
  id: string;
  packName: string;
  packPrice: number;
  role: {
    id: string;
    roleName: string;
  };
};

export type PackPurchase = {
  id: string;
  account: {
    id: string;
    role: {
      id: string;
      roleName: string;
    };
  };
  packId: string;
  renewalDate: string;
};

export type PackListResponse = {
  message: string,
  packs: Pack[]
}

export type RenewalListResponse = {
  message: string,
  packs: PackPurchase[]
}
