import { User } from "@/database/entities/user";
import { ClassToObject } from "@/types/utils";
import { FindOptionsSelect } from "typeorm";

export type PublicUserDTOProps = ClassToObject<PublicUserDTO>;

export const publicUserFindSelection = {
  username: true,
  name: true,
} satisfies Readonly<FindOptionsSelect<User>>;

export class PublicUserDTO {
  public readonly username: string;
  public readonly name: string;

  public constructor(props: PublicUserDTOProps) {
    this.username = props.username;
    this.name = props.name;
  }

  public static from(user: User): PublicUserDTO {
    return new PublicUserDTO(user);
  }
}
