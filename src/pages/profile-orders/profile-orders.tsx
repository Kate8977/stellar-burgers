import { ProfileOrdersUI } from '@ui-pages';
import { useCallback } from 'react';

import { useOrdersRefresh } from '@hooks/use-orders-refresh';
import {
  fetchProfileOrders,
  selectProfileOrders,
} from '@services/slices/profile-orders-slice';
import { useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);

  const loadOrders = useCallback((): void => {
    void dispatch(fetchProfileOrders());
  }, [dispatch]);

  useOrdersRefresh(loadOrders);

  return <ProfileOrdersUI orders={orders} />;
};
