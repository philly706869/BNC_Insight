export type CurrentUser = {
  username: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
};

export type User = {
  username: string;
  name: string;
  createdAt: Date;
};
