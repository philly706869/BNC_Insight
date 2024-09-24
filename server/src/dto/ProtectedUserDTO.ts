import { User } from "@/database/entities/User";
import { ClassToObject } from "@/types/utils";

export type ProtectedUserDTOProps = ClassToObject<ProtectedUserDTO>;

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
