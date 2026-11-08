import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectFeedOrders } from '@services/slices/feed-slice';
import { selectIngredients } from '@services/slices/ingredients-slice';
import {
  fetchOrderByNumber,
  selectViewedOrder,
  selectViewedOrderError,
} from '@services/slices/order-details-slice';
import { selectProfileOrders } from '@services/slices/profile-orders-slice';
import { useDispatch, useSelector } from '@services/store';

import type { TIngredient, TOrder } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const viewedOrder = useSelector(selectViewedOrder);
  const viewedOrderError = useSelector(selectViewedOrderError);

  const orderNumber = Number(number);
  const orderFromLists = useMemo(
    () =>
      profileOrders.find((order) => order.number === orderNumber) ??
      feedOrders.find((order) => order.number === orderNumber) ??
      null,
    [profileOrders, feedOrders, orderNumber]
  );

  useEffect(() => {
    if (!number || orderFromLists) return;

    void dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, number, orderFromLists, orderNumber]);

  const orderData: TOrder | null =
    orderFromLists ?? (viewedOrder?.number === orderNumber ? viewedOrder : null);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    if (viewedOrderError) {
      return <p className="text text_type_main-default">{viewedOrderError}</p>;
    }

    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
