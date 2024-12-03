import { ApiResponse } from "@/lib/api-response";

export const useFetch = async <T, D>(
  path: string,
  method?: string,
  data?: T
): Promise<ApiResponse<D>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const response = (await res.json()) as ApiResponse<D>;

  return response;
};
