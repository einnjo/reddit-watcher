import { AxiosError, AxiosInstance } from 'axios';

export function intercept401AndReauth(
  instance: AxiosInstance,
  getTokenFunc: () => Promise<string>,
) {
  instance.interceptors.response.use(undefined, (error: AxiosError) => {
    if (
      error.config &&
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      return getTokenFunc().then((token: string) => {
        error.config.headers.Authorization = 'Bearer ' + token;
        instance.defaults.headers.common.Authorization = 'Bearer ' + token;
        return instance.request(error.config);
      });
    }

    return Promise.reject(error);
  });
}
