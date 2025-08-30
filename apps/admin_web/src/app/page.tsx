import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE } from "@/lib/config";

export default async function RootRedirect() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  redirect(token ? "/dashboard" : "/login");
}
