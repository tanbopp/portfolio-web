import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "./session";

export const SESSION_COOKIE = "admin_session";

/** Whether the current request has a valid admin session. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : false;
}

/** Guard for admin server components: redirects to /auth when logged out. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/auth");
}
