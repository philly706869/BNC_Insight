import { TextField } from "@mui/material";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof TextField>;

export function GeneralTextField(props: Props) {
  return (
    <TextField fullWidth autoComplete="off" spellCheck="false" {...props} />
  );
}
