import { AsyncLocalStorage } from 'node:async_hooks';
export const timezoneStorage = new AsyncLocalStorage<string>();

export const getTimezone = (): string => {
  return timezoneStorage.getStore() || 'UTC';
};
