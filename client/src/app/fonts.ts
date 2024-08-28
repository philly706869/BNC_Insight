import { Cormorant, Inter, Roboto_Slab } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const fonts = {
  inter: inter.className,
  cormorant: cormorant.className,
  robotoSlab: robotoSlab.className,
};
