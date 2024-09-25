import { User } from "@/database/entities/User";
import { ClassToObject } from "@/types/utils";

export type PublicUserDTOProps = ClassToObject<PublicUserDTO>;

export class PublicUserDTO {
  public username: string;
  public name: string;

  public constructor(props: PublicUserDTOProps) {
    this.username = props.username;
    this.name = props.name;
  }

  public static from(user: User): PublicUserDTO {
    return new PublicUserDTO(user);
  }
}
