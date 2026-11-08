import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useCallback } from 'react';

import { useOrdersRefresh } from '@hooks/use-orders-refresh';
import { fetchFeeds, selectFeed } from '@services/slices/feed-slice';
import { useDispatch, useSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(selectFeed);

  const handleGetFeeds = useCallback((): void => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  useOrdersRefresh(handleGetFeeds);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p className="text text_type_main-medium mt-10 ml-10">
        Не удалось загрузить ленту заказов
      </p>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
