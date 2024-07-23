export type Wallet = {
    id: string;
    account: {
        id: string;
        role: string;
    };
};

export type Transaction = {
    wallet: Wallet;
    status: string;
    datetime: string;
    orderCode: number;
    amount: number;
    bank: boolean;
    walletId: string;
};

export type BankTransaction = {
    accountNumber: string;
    amount: number;
    code: string;
    counterAccountBankId: string;
    counterAccountBankName: string;
    counterAccountName: string;
    counterAccountNumber: string;
    currency: string;
    desc: string;
    description: string;
    orderCode: number;
    paymentLinkId: string;
    reference: string;
    transactionDateTime: Date;
    virtualAccountName: string;
    virtualAccountNumber: string;
};
