import { useEffect } from 'react';

const ORDERS_REFRESH_MS = 2000;

export const useOrdersRefresh = (loadOrders: () => void): void => {
  useEffect((): (() => void) => {
    loadOrders();

    const timerId = window.setInterval(loadOrders, ORDERS_REFRESH_MS);
    return (): void => {
      window.clearInterval(timerId);
    };
  }, [loadOrders]);
};
