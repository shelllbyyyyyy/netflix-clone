export type ApiResponse<T> = {
  code: number;
  status: string;
  errors: string;
  data: T;
  message: string;
};
