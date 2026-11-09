import { FeedInfoUI } from '@ui';

import { selectFeed } from '@services/slices/feed-slice';
import { useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

const ORDERS_IN_COLUMN = 20;

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, ORDERS_IN_COLUMN);

export const FeedInfo = (): React.JSX.Element => {
  const feed = useSelector(selectFeed);
  const readyOrders = getOrders(feed.orders, 'done');
  const pendingOrders = [
    ...getOrders(feed.orders, 'pending'),
    ...getOrders(feed.orders, 'created'),
  ].slice(0, ORDERS_IN_COLUMN);

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
