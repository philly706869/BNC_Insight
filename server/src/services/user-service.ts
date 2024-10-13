import { User } from "@/database/entities/user";
import { UserValue } from "@/database/values/user-values";
import { PublicUserDTO, publicUserFindSelection } from "@/dto/public-user-dto";
import { DataSource, Repository } from "typeorm";

export class UserService {
  private readonly userRepository: Repository<User>;

  public constructor(private readonly dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
  }

  public async get(
    username: UserValue.Username
  ): Promise<PublicUserDTO | null> {
    const user = await this.userRepository.findOne({
      where: { username: username.value },
      select: publicUserFindSelection,
    });
    return user ? PublicUserDTO.from(user) : null;
  }

  public async patch(
    uid: number,
    data: { username?: UserValue.Username; name?: UserValue.Name }
  ): Promise<boolean> {
    const result = await this.userRepository.update(
      { uid },
      { username: data.username?.value, name: data.name?.value }
    );
    return Boolean(result.affected);
  }

  public async delete(uid: number): Promise<boolean> {
    const result = await this.userRepository.delete({ uid });
    return Boolean(result.affected);
  }
}
