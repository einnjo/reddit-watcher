import { AxiosError, AxiosInstance } from 'axios';

import { wait } from './utils';

export function intercept500AndRetry(instance: AxiosInstance, maxBackoff: number = 1000 * 60 * 15) {
  const initialBackoff = 3000;
  instance.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.config && error.response && error.response.status >= 500) {
      const backoff = (error.config as any).backoff || initialBackoff;
      if (backoff > maxBackoff) {
        return Promise.reject(error);
      }

      return wait(backoff).then(() => {
        (error.config as any).backoff = backoff * 2;
        return instance.request(error.config);
      });
    }

    return Promise.reject(error);
  });
}
