import { cookies } from "next/headers";
import { adminToken } from "./catalog";

export const ADMIN_COOKIE = "sonora_admin";

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(token) && token === adminToken();
}
