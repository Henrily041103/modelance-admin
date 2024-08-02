type GenderType = {
  id: string;
  genderName: string;
};

type RoleType = {
  id: string;
  roleName: string;
};

export type StatusType = {
  id: string;
  statusName: string;
};

export type Account = {
  username: string;
  fullName: string;
  gender: GenderType;
  role: RoleType;
  status: StatusType;
  avatar: string;
  createDate: string; // Alternatively, use Date if you want to parse this into a Date object
  dateOfBirth: string; // Same here, use Date if preferred
  password: string;
  id: string;
  email: string;
};

