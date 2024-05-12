import { Request, Response } from "express";

export default function (req: Request, res: Response) {
  console.log(req.body);
  const { id, password, name, authToken } = req.body;

  const errors: { error: string; invalidValueName: string }[] = [];

  switch (true) {
    case id.length < 1:
      errors.push({ error: "ID cannot be empty.", invalidValueName: "id" });
      break;
    case id.length > 32:
      errors.push({
        error: "ID cannot be greater than 32 characters.",
        invalidValueName: "id",
      });
      break;
    case !/^\w+$/.test(id):
      errors.push({
        error: "ID can only contain A-Z, a-z, 0-9, _.",
        invalidValueName: "id",
      });
      break;
  }

  res.status(201).end();
}
