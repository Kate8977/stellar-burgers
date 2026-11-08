import { useEffect } from 'react';

const ORDERS_REFRESH_MS = 2000;

/**
 * Лента заказов приходит обычным запросом. Пока экран открыт,
 * запрашиваем её сразу и затем каждые пару секунд — так новый заказ
 * появляется без ручного обновления.
 */
export const useOrdersRefresh = (loadOrders: () => void): void => {
  useEffect((): (() => void) => {
    loadOrders();

    const timerId = window.setInterval(loadOrders, ORDERS_REFRESH_MS);
    return (): void => {
      window.clearInterval(timerId);
    };
  }, [loadOrders]);
};
