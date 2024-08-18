export type Session = {
  user?: User;
};

export type User = {
  uuid: string;
  name: string;
  isAdmin: boolean;
  createdAt: number;
};
