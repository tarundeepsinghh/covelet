import {
  HttpException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AxiosError } from 'axios';

export function handleAxiosError(error: Error) {
  const axiosErr = error as AxiosError;
  if (!axiosErr.isAxiosError) {
    console.error('ERROR:', error);
    throw error;
  }
  if (axiosErr.code === 'ECONNREFUSED') {
    console.warn(
      `WARNING: Remote service refused to connect (${
        (axiosErr as any).address
      }:${(axiosErr as any).port})`,
    );
    throw new ServiceUnavailableException(
      `Service at ${(axiosErr as any).address}:${
        (axiosErr as any).port
      } is unavailable`,
    );
  } else if (axiosErr.code === 'ECONNABORTED') {
    console.warn(
      `WARNING: Remote service request timeout for (${axiosErr.config.method.toUpperCase()} ${
        axiosErr.config.url
      })`,
    );
    throw new RequestTimeoutException(
      `Service at ${axiosErr.config.url} took too long to respond. Please try again later`,
    );
  }
  throw new HttpException(axiosErr.response.data, axiosErr.response.status);
}
