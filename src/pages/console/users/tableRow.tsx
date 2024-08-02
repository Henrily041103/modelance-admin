import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Account } from "@/types/general";
import { ColumnDef } from "@tanstack/react-table";
import {
  Building,
  Clock,
  CloseCircle,
  Man,
  Profile,
  TickCircle,
  Woman,
} from "iconsax-react";
import { Pack, PackPurchase } from "@/types/premium";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AxiosInstance } from "axios";
import { handleToggleAccount } from "./functions";
import { QueryClient } from "@tanstack/react-query";

function getDifferenceInDays(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day
  const diffInTime = date2.getTime() - date1.getTime(); // Difference in milliseconds
  return Math.round(diffInTime / oneDay); // Difference in days
}

export function getColumns(
  premiumMap: Record<string, PackPurchase[]>,
  packMap: Record<string, Pack>,
  axios: AxiosInstance,
  handleToast: (message: string) => void,
  queryClient: QueryClient
) {
  const columns: ColumnDef<Account>[] = [
    {
      id: "avatar",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Avatar>
            <AvatarImage src={user.avatar} />
          </Avatar>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        const user = row.original;
        const genderIcon = user.gender ? (
          user.gender.genderName.toLowerCase() === "male" ? (
            <Man size={24} color="#FF8A65" />
          ) : (
            <Woman size={24} color="#FF8A65" />
          )
        ) : null;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{genderIcon}</TooltipTrigger>
              <TooltipContent>
                <p>{user.gender?.genderName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },

    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const roleIcon =
          row.original.role.roleName.toLowerCase() === "employer" ? (
            <Building size={24} color="#555555" />
          ) : (
            <Profile size={24} color="#555555" />
          );
        return roleIcon;
      },
    },
    {
      accessorKey: "premium",
      header: "Premium",
      cell: ({ row }) => {
        const user = row.original;
        const purchases = premiumMap[user.id];
        const pack = packMap[user.role.id];
        let purchase = undefined;
        if (purchases && pack) {
          purchase = purchases.find((p) => p.packId === pack.id);
        }
        const purchaseData = {
          text: "No purchases",
          trigger: <CloseCircle size={24} color="#555555" />,
        };
        if (purchase) {
          const date = getDifferenceInDays(
            new Date(purchase.renewalDate),
            new Date()
          );
          if (date > 30) {
            purchaseData.text = "Late renewal";
            purchaseData.trigger = <Clock size={24} color="#555555" />;
          } else {
            purchaseData.text = "Have premium";
            purchaseData.trigger = <TickCircle size={24} color="#555555" />;
          }
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{purchaseData.trigger}</TooltipTrigger>
              <TooltipContent>
                <p>{purchaseData.text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        const statusIcon =
          user.status.statusName === "inactive" ? (
            <CloseCircle size={24} color="#555555" />
          ) : (
            <TickCircle size={24} color="#555555" />
          );

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{statusIcon}</TooltipTrigger>
              <TooltipContent>
                <p>{user.status.statusName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: "activate",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button
            type="button"
            onClick={() => {
              handleToggleAccount(axios, user.id, user.status, handleToast);
              queryClient.invalidateQueries({queryKey: ['users']})
              queryClient.refetchQueries({queryKey: ['users']})
            }}
          >
            {user.status.statusName === "inactive" ? "Activate" : "Deactivate"}
          </Button>
        );
      },
    },
  ];

  return columns;
}
