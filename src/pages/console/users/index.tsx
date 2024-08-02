import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleGetPacks, handleGetRenewals, handleGetUsers } from "./functions";
import useLogin from "@/hooks/useLogin";
import { getColumns } from "./tableRow";
import "./index.css";
import { DataTable } from "@/components/ui/fullTable";
import { useToast } from "@/components/ui/use-toast";

export default function UserPage() {
  const { axios } = useLogin();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const userData = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await handleGetUsers(axios);
      return result;
    },
  });

  const purchaseData = useQuery({
    queryKey: ["renewal"],
    queryFn: async () => {
      const result = await handleGetRenewals(axios);
      return result;
    },
  });

  const packData = useQuery({
    queryKey: ["pack"],
    queryFn: async () => {
      const result = await handleGetPacks(axios);
      return result;
    },
  });

  return (
    <div className="container mx-auto py-10">
      {purchaseData.data && userData.data && packData.data && (
        <DataTable
          columns={getColumns(purchaseData.data, packData.data, axios, (msg) =>
            toast({ description: msg }), queryClient
          )}
          data={userData.data}
        />
      )}
    </div>
  );
}
