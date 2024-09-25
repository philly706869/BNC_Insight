import { userRepository } from "@/database/repositories";
import {
  ProtectedUserDTO,
  protectedUserFindSelection,
} from "@/dto/protected-user-dto";
import { PublicUserDTO, publicUserFindSelection } from "@/dto/public-user-dto";
import { SessionData } from "express-session";

export async function getUser(username: string): Promise<PublicUserDTO | null> {
  const user = await userRepository.findOne({
    where: { username },
    select: publicUserFindSelection,
  });
  return user ? PublicUserDTO.from(user) : null;
}

export async function getUserFromSession(
  session: Partial<SessionData>
): Promise<ProtectedUserDTO | null> {
  const { userUid } = session;
  if (!userUid) return null;
  const user = await userRepository.findOne({
    where: { uid: userUid },
    select: protectedUserFindSelection,
  });
  return user ? ProtectedUserDTO.from(user) : null;
}
