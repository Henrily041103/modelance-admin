import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleGetPacks, handleGetRenewals, handleGetUsers } from "./functions";
import useLogin from "@/hooks/useLogin";
import { getColumns } from "./tableRow";
import "./index.css";
import { DataTable } from "@/components/ui/fullTable";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { StatusType } from "@/types/general";

export default function UserPage() {
  const { axios } = useLogin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<StatusType | undefined>(undefined);
  const [filterRole, setFilterRole] = useState<string | undefined>(undefined);

  const userData = useQuery({
    queryKey: ["users", filterStatus, filterRole],
    queryFn: async () => {
      const result = await handleGetUsers(axios, filterStatus, filterRole);
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

  const handleFilterStatus = (status: StatusType | undefined) => {
    setFilterStatus(status);
    queryClient.invalidateQueries({ queryKey: ['users', filterStatus, filterRole] });
    queryClient.refetchQueries({ queryKey: ['users', filterStatus, filterRole] });
  };

  const handleFilterRole = (role: string | undefined) => {
    setFilterRole(role);
    queryClient.invalidateQueries({ queryKey: ['users', filterStatus, filterRole] });
    queryClient.refetchQueries({ queryKey: ['users', filterStatus, filterRole] });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="filter-container">
        <div className="filter-buttons">
          <button
            className={`filter-button ${!filterStatus ? 'active' : ''}`}
            onClick={() => handleFilterStatus(undefined)}
          >
            All
          </button>
          <button
            className={`filter-button ${filterStatus?.statusName === 'active' ? 'active' : ''}`}
            onClick={() => handleFilterStatus({ statusName: 'active', id: 'active' })}
          >
            Active
          </button>
          <button
            className={`filter-button ${filterStatus?.statusName === 'inactive' ? 'active' : ''}`}
            onClick={() => handleFilterStatus({ statusName: 'inactive', id: 'inactive' })}
          >
            Inactive
          </button>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-button ${!filterRole ? 'active' : ''}`}
            onClick={() => handleFilterRole(undefined)}
          >
            All
          </button>
          <button
            className={`filter-button ${filterRole === 'model' ? 'active' : ''}`}
            onClick={() => handleFilterRole('model')}
          >
            Model
          </button>
          <button
            className={`filter-button ${filterRole === 'employer' ? 'active' : ''}`}
            onClick={() => handleFilterRole('employer')}
          >
            Employer
          </button>
        </div>
      </div>
      {purchaseData.data && userData.data && packData.data && (
        <DataTable
          columns={getColumns(purchaseData.data, packData.data, axios, (msg) =>
            toast({ description: msg }), queryClient
          )}
          data={userData.data.filter((user) => (!filterStatus || user.status.statusName === filterStatus.statusName) && (!filterRole || user.role.roleName.toLowerCase() === filterRole))}
        />
      )}
    </div>
  );
}
