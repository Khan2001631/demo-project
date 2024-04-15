import { updateIsRefreshTokenExpired, updateIsSessionExpired } from "./commonSlice";

const ApiMiddleWare = (data: any, dispatch: any) => {
  try {
    if (data?.data?.statusCode == 401) {
      dispatch(updateIsSessionExpired(true));
    }
    if (data?.data?.statusCode == 403) {
      dispatch(updateIsRefreshTokenExpired(true));
    }
  } catch (error: any) { }
};

export default ApiMiddleWare;
