import { Request, Response } from "express";
import url from "url";

export default function (req: Request, res: Response) {
  res.redirect(
    url.format({
      pathname: "/",
      query: {
        id: req.body.id,
        name: req.body.name,
      },
    })
  );
}
