export interface CustomResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
