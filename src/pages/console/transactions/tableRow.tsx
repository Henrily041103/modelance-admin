import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Transaction } from "@/types/transactions";
import { ColumnDef } from "@tanstack/react-table";
import {
  Bank,
  Clock,
  CloseCircle,
  Eye,
  TickCircle,
  Wallet,
} from "iconsax-react";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "orderCode",
    header: "Order Code",
  },
  {
    accessorKey: "amount",
    header: "Amount",
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
      switch (status.toLowerCase()) {
        case "approved":
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <TickCircle size={24} color="#37d67a" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Approved</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        case "pending":
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Clock size={24} color="#dce775" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pending</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        case "cancelled":
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CloseCircle size={24} color="#f47373" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cancelled</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        default:
          return status;
      }
    },
  },
  {
    accessorKey: "bank",
    header: "Type",
    cell: ({ row }) => {
      const bank = row.original.bank;
      if (bank) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Bank size={24} color="#555555" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Bank transaction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Wallet size={24} color="#555555" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Wallet transaction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
  },
  {
    accessorKey: "datetime",
    header: "Transaction Time",
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
    cell: ({ row }) => (
      <Button
        variant="secondary"
        onClick={() => {
          console.log(row.original.orderCode);
        }}
      >
        <Eye size={24} color="#FF8A65" />
      </Button>
    ),
  },
];
