import { Router } from "express";

export const router = Router();

router.post("/", (req, res) => {
  res.status(501).end();
});

router.get("/", (req, res) => {
  res.status(501).end();
});

// accountRouter.post(`/`, async (req, res) => {
//   try {
//     const { token, id, password, name } = await bodySchema.validateAsync(
//       req.body
//     );

//     const user = await User.create({
//       id,
//       password: bcrypt.hashSync(password, 10),
//       name,
//       isAdmin: token.isAdminToken,
//     });

//     await token.update({
//       allocedUserUid: user.uid,
//     });

//     res.status(201).end();
//   } catch (error) {
//     if (Joi.isError(error)) res.status(400).end();
//     else {
//       logger.error(error);
//       res.status(500).end();
//     }
//   }
// });

// const querySchema = Joi.object<{ uuid: string | undefined }>({
//   uuid: Joi.string().uuid().optional(),
// }).unknown(true);

// accountRouter.get(`/`, async (req, res) => {
//   try {
//     const { uuid } = await querySchema.validateAsync(req.query);
//     const uid = req.session.user?.uid;

//     const user = uuid
//       ? await User.findOne({ where: { uuid } })
//       : uid
//       ? await User.findByPk(uid)
//       : null;

//     if (!user) {
//       res.status(400).end();
//       return;
//     }

//     res.status(200).json({
//       user: {
//         uuid: user.uuid,
//         name: user.name,
//         isAdmin: user.isAdmin,
//       },
//     });
//   } catch (error) {
//     if (Joi.isError(error)) res.status(400).end();
//     else {
//       logger.error(error);
//       res.status(500).end();
//     }
//   }
// });
