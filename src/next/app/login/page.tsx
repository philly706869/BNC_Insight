import Input from "@/components/input";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BNC_Insight Login",
};

export default function LogIn() {
  return (
    <>
      <h1>Login</h1>
      <Input placeholder="Test" />
    </>
  );
}
