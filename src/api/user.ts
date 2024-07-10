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
