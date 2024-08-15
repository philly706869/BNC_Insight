import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BNC_Insight User",
};

type Props = {
  params: {
    user: string;
  };
};

export default function User({ params }: Props) {
  return <></>;
}
