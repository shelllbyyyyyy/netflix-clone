"use server";

import { cookies } from "next/headers";

export async function useGetCookies() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("refresh_token")?.value;

  return accessToken || null;
}
