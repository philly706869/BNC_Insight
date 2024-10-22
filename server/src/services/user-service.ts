import { User } from "@/database/tables/user";
import { UserValue } from "@/database/values/user-values";
import { PublicUserDTO, publicUserFindSelection } from "@/dto/public-user-dto";
import { UserNotFoundError } from "@/errors/service-errors";
import { DataSource, Repository } from "typeorm";

export class UserService {
  private readonly userRepository: Repository<User>;

  public constructor(dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
  }

  /**
   * @throws {UserNotFoundError}
   */
  public async get(username: UserValue.Username): Promise<PublicUserDTO> {
    const user = await this.userRepository.findOne({
      where: { username: username.value },
      select: publicUserFindSelection,
    });
    if (!user) return Promise.reject(new UserNotFoundError());
    return PublicUserDTO.from(user);
  }

  /**
   * @throws {UserNotFoundError}
   */
  public async patch(
    uid: number,
    data: { username?: UserValue.Username; name?: UserValue.Name }
  ): Promise<void> {
    const result = await this.userRepository.update(
      { uid },
      { username: data.username?.value, name: data.name?.value }
    );
    if (!Boolean(result.affected))
      return Promise.reject(new UserNotFoundError());
  }

  /**
   * @throws {UserNotFoundError}
   */
  public async delete(uid: number): Promise<void> {
    const result = await this.userRepository.delete({ uid });
    if (!Boolean(result.affected))
      return Promise.reject(new UserNotFoundError());
  }
}
