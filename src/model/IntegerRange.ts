type Range<Number extends number | BigInt> = {
  MIN: Number;
  MAX: Number;
};

type IntegerRange<Number extends number | BigInt> = Range<Number> & {
  UNSIGNED: Range<Number>;
};

type IntegerRanges = {
  TINYINT: IntegerRange<number>;
  SMALLINT: IntegerRange<number>;
  MEDIUMINT: IntegerRange<number>;
  INTEGER: IntegerRange<number>;
  BIGINT: IntegerRange<BigInt>;
};

export const IntegerRanges: IntegerRanges = {
  TINYINT: {
    MIN: -(2 ** 7),
    MAX: 2 ** 7 - 1,
    UNSIGNED: {
      MIN: 0,
      MAX: 2 ** 8 - 1,
    },
  },
  SMALLINT: {
    MIN: -(2 ** 15),
    MAX: 2 ** 15 - 1,
    UNSIGNED: {
      MIN: 0,
      MAX: 2 ** 16 - 1,
    },
  },
  MEDIUMINT: {
    MIN: -(2 ** 23),
    MAX: 2 ** 23 - 1,
    UNSIGNED: {
      MIN: 0,
      MAX: 2 ** 24 - 1,
    },
  },
  INTEGER: {
    MIN: -(2 ** 31),
    MAX: 2 ** 31 - 1,
    UNSIGNED: {
      MIN: 0,
      MAX: 2 ** 32 - 1,
    },
  },
  BIGINT: {
    MIN: -(2n ** 63n),
    MAX: 2n ** 63n - 1n,
    UNSIGNED: {
      MIN: 0n,
      MAX: 2n ** 64n - 1n,
    },
  },
};
