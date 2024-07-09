import { Router } from "express";

export const authRouter = Router();

authRouter.get("/", (req, res) => {
  console.log(req.query);
});

// query("token").isLength({ min: 1, max: 128 }),
//   async (req, res) => {
//     const token: string = req.query!!.token;
//     const valid =
//       !validationResult(req).isEmpty() || (await AuthToken.isAllocable(token));
//     res.status(200).json({ valid });
//   }

// query("id"), (req, res) => {
//   if (!validationResult(req).isEmpty()) {
//     res
//       .status(400)
//       .error({ error: "ID_NOT_PROVIDED", message: "You must provide id." });
//     return;
//   }

//   const id: string = req.query!!.id;
//   const result = User.validateId(id);
//   const valid = result === null;

//   res.status(200).json({
//     valid,
//     message: result,
//   });
// }
