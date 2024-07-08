import { Router } from "express";
import { query, validationResult } from "express-validator";
import { User } from "../model/User.js";

export const userRouter = Router();

// interface A {}

// class CA<const T extends string> implements A {}
// class CB<const T extends string> implements A {}

// function a<const T extends Array<A>>(
//   list: T,
//   handler: /*RequestHandler &*/ {
//     (
//       req: Request & { query: { [K in T[number]]: K extends CA<string> ? K : never },
//       res: Response,
//       next: NextFunction
//     ): void;
//   }
// ) {
//   throw 0;
// }

// type Extract<T, E> = T extends E ? (E extends T ? never : T) : never;

// if (false) {
//   const v = a([new CA<"a">(), new CB<"b">()], (req, res) => {
//     req.query;
//   });
// }

// type a = CA<"abc"> extends CA<string> ? null : never

userRouter.get("/", query("uuid").isUUID().optional(), async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    res.status(400).error({
      error: "INVALID_UUID",
      message: "Uuid is not in correct format.",
    });
    return;
  }

  const queryUUID: string | undefined = req.query!!.uuid;
  const requestUID = req.session.user?.uid;

  const user = queryUUID
    ? await User.findOne({ where: { uuid: queryUUID } })
    : requestUID
    ? await User.findByPk(requestUID)
    : undefined;

  switch (user) {
    case undefined:
      res.status(400).error({
        error: "USER_SPECIFIC_UNABLE",
        message: "You must be logged in or provide id.",
      });
      break;
    case null:
      res.status(404).error({
        error: "USER_NOT_FOUND",
        message: "The requested user does not exist.",
      });
      break;
    default:
      res.status(200).json({
        user: {
          uuid: user.uuid,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      });
      break;
  }
});
