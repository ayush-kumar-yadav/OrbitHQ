export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const successResponse = <T>(
  data?: T,
  message = "Success"
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (
  message = "Something went wrong"
): ApiResponse<null> => {
  return {
    success: false,
    message,
    data: null,
  };
};