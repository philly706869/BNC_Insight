import { FC } from "react";

type Props = JSX.IntrinsicElements["img"];

export const Logo: FC<Props> = (props) => {
  return <img src="/logo.png" alt="logo" {...props} />;
};
