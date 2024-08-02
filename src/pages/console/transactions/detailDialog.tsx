import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Account } from "@/types/general";
import { BankTransaction, Transaction } from "@/types/transactions";

export type DetailDialogProps = {
  transaction: Transaction;
  bank?: BankTransaction;
  user?: Account;
};

export default function DetailDialog({
  transaction,
  bank,
  user,
}: DetailDialogProps) {
  const type = transaction.wallet ? "Wallet" : "Bank";
  return (
    <DialogContent className="detail-dialog-content max-w-4xl h-max">
      <DialogHeader>
        <DialogTitle>Transaction data</DialogTitle>
        <DialogDescription>
          <div className="detail-dialog-body flex w-full justify-evenly space-x-2 bg-muted py-8 ">
            {/* Transaction Data */}
            <div className="flex flex-col detail-dialog-transaction gap-3 ">
              <div className="flex flex-col gap-2">
                <Label htmlFor="orderCode">Order Code</Label>
                <Input
                  className="cursor-default text-stone-950"
                  id="orderCode"
                  value={transaction.orderCode}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount">Transaction Amount</Label>
                <Input
                  className="cursor-default text-stone-950"
                  id="amount"
                  value={transaction.amount}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Transaction Date</Label>
                <Input
                  className="cursor-default text-stone-950"
                  id="date"
                  value={new Date(transaction.datetime).toLocaleDateString()}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="time">Transaction Time</Label>
                <Input
                  className="cursor-default text-stone-950"
                  id="time"
                  value={new Date(transaction.datetime).toLocaleTimeString()}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Type of transaction</Label>
                <Input
                  className="cursor-default text-stone-950"
                  id="type"
                  value={type}
                  disabled
                />
              </div>
            </div>

            {/* Bank Data */}
            {bank && (
              <div className="detail-dialog-bank flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="counterBankId">Counter Bank ID</Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="counterBankId"
                    value={bank.counterAccountBankId}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="bankName"
                    value={bank.counterAccountBankName}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="accountName"
                    value={bank.counterAccountName}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="accountNumber"
                    value={bank.accountNumber}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bankDescription">Description</Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="bankDescription"
                    value={bank.description}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="virtualAccountName">
                    Virtual Account Name
                  </Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="virtualAccountName"
                    value={bank.virtualAccountName}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="virtualAccountNumber">
                    Virtual Account Number
                  </Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="virtualAccountNumber"
                    value={bank.virtualAccountNumber}
                    disabled
                  />
                </div>
              </div>
            )}

            {/* User Info */}
            {user && (
              <div className="detail-dialog-user flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="accountId">Account ID</Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="accountId"
                    value={user.id}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="username"
                    value={user.username}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="role"
                    value={user.role.roleName}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="walletId">Wallet ID</Label>
                  <Input
                    className="cursor-default text-stone-950"
                    id="walletId"
                    value={transaction.wallet.id}
                    disabled
                  />
                </div>
              </div>
            )}
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
