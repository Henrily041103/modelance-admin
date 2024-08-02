import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Account } from "@/types/general";
import { BankTransaction, Transaction } from "@/types/transactions";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowSwapVertical,
  Bank,
  Building,
  Clock,
  CloseCircle,
  Eye,
  MessageQuestion,
  Profile,
  TickCircle,
  UsdCoin,
  Wallet,
} from "iconsax-react";
import DetailDialog from "./detailDialog";
import { PackPurchase } from "@/types/premium";

export function getColumns(
  accountMap: Record<string, Account>,
  bankMap: Record<string, BankTransaction>,
  renewalMap: Record<string, PackPurchase>
) {
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "orderCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order Code
            <ArrowSwapVertical className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowSwapVertical className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        if (amount > 0) {
          const formatted = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount);

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-center font-medium positive">
                    {formatted}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Positive</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        } else {
          const formatted = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(-amount);

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-center font-medium negative">
                    {formatted}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Negative</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const statusDisplay = {
          text: "Unknown",
          trigger: <MessageQuestion size={24} color="#37d67a" />,
        };

        switch (status.toLowerCase()) {
          case "approved":
            statusDisplay.text = "Approved";
            statusDisplay.trigger = <TickCircle size={24} color="#37d67a" />;
            break;
          case "pending":
            statusDisplay.text = "Approved";
            statusDisplay.trigger = <Clock size={24} color="#37d67a" />;
            break;
          case "cancelled":
            statusDisplay.text = "Cancelled";
            statusDisplay.trigger = <CloseCircle size={24} color="#37d67a" />;
            break;
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{statusDisplay.trigger}</TooltipTrigger>
              <TooltipContent>
                <p>{statusDisplay.text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "bank",
      header: "Type",
      cell: ({ row }) => {
        const bank = row.original.bank;
        const bankDisplay = {
          text: "Unknown",
          trigger: <MessageQuestion size={24} color="#37d67a" />,
        };
        if (bank) {
          bankDisplay.text = "Bank transaction";
          bankDisplay.trigger = <Bank size={24} color="#555555" />;
        } else {
          const packRenew = renewalMap[row.original.id];
          if (!packRenew) {
            bankDisplay.text = "Wallet transaction";
            bankDisplay.trigger = <Wallet size={24} color="#555555" />;
          } else {
            bankDisplay.text = "Premium renewal";
            bankDisplay.trigger = <UsdCoin size={24} color="#555555" />;
          }
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{bankDisplay.trigger}</TooltipTrigger>
              <TooltipContent>
                <p>{bankDisplay.text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const userId = row.original.wallet.account.id;
        const user = accountMap[userId];
        const role = row.original.wallet.account.role;
        const roleIcon =
          role.toLowerCase() === "employer" ? (
            <Building size={24} color="#555555" />
          ) : (
            <Profile size={24} color="#555555" />
          );
        return (
          user && (
            <span className="admin-transaction-user-row">
              <span>{user.username}</span>{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>{roleIcon}</TooltipTrigger>
                  <TooltipContent>
                    <p>{role}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          )
        );
      },
    },
    {
      accessorKey: "datetime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Transaction Time
            <ArrowSwapVertical className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const datetime = row.original.datetime;
        const date = new Date(datetime);
        const formattedDate = date.toLocaleString();
        return <div className="text-center font-medium">{formattedDate}</div>;
      },
    },
    {
      id: "details",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original;
        const bank = bankMap[transaction.orderCode];
        const user = accountMap[transaction.wallet.account.id];
        return (
          <Dialog>
            <DialogTrigger>
              <Button variant="secondary">
                <Eye size={24} color="#FF8A65" />
              </Button>
            </DialogTrigger>
            <DetailDialog transaction={transaction} user={user} bank={bank} />
          </Dialog>
        );
      },
    },
  ];

  return columns;
}
