export type Account = {
  id: string;
  username: string;
  fullName: string;
  role: {
    id: string;
    roleName: string;
  };
  avatar: string;
};

