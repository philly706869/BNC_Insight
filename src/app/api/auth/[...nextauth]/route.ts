import { User } from "@/lib/typeorm/model/User";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      credentials: {
        id: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const { id, password } = credentials;
        const user = await User.findOne({ where: { id } });
        if (!user) return null;
        const valid = User.validatePassword(password) === null;
        if (!valid) return null;
        const compared = await bcrypt.compare(password, user.password);
        if (!compared) return null;
        return { id: user.id, name: user.name, isAdmin: user.isAdmin };
      },
    }),
  ],
  pages: {},
  callbacks: {},
});

export { handler as GET, handler as POST };
