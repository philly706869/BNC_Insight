import { ClassToObject } from "@/types/utils";
import { PublicUserDTO } from "./public-user-dto";

export type ProtectedUserDTOProps = ClassToObject<ProtectedUserDTO>;

export class ProtectedUserDTO extends PublicUserDTO {
  public readonly createdAt: string;
  public readonly isAdmin: boolean;

  public constructor(props: ProtectedUserDTOProps) {
    super(props);
    this.createdAt = props.createdAt;
    this.isAdmin = props.isAdmin;
  }
}
