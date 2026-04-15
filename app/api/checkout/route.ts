import { Checkout } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";

const server = (process.env.NEXT_PUBLIC_POLAR_SERVER || "sandbox") as "sandbox" | "production";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/confirmation?checkout_id={CHECKOUT_ID}`,
  server: server,
});
