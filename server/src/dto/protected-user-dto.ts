import { User } from "@/database/entities/user";
import { ClassToObject } from "@/types/utils";
import { FindOptionsSelect } from "typeorm";

export type ProtectedUserDTOProps = ClassToObject<ProtectedUserDTO>;

export const protectedUserFindSelection = {
  username: true,
  name: true,
  createdAt: true,
  isAdmin: true,
} satisfies Readonly<FindOptionsSelect<User>>;

export class ProtectedUserDTO {
  public username: string;
  public name: string;
  public createdAt: string;
  public isAdmin: boolean;

  public constructor(props: ProtectedUserDTOProps) {
    this.username = props.username;
    this.name = props.name;
    this.createdAt = props.createdAt;
    this.isAdmin = props.isAdmin;
  }

  public static from(user: User): ProtectedUserDTO {
    return new ProtectedUserDTO({
      ...user,
      createdAt: user.createdAt.toISOString(),
    });
  }
}
