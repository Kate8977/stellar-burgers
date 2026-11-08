import { BurgerConstructorUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Modal } from '@components/modal';
import {
  clearConstructor,
  selectConstructorItems,
} from '@services/slices/constructor-slice';
import {
  clearOrder,
  createOrder,
  selectOrder,
  selectOrderError,
  selectOrderRequest,
} from '@services/slices/order-slice';
import { selectIsAuthChecked, selectUser } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrder);
  const orderError = useSelector(selectOrderError);
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect((): (() => void) => {
    return (): void => {
      dispatch(clearOrder());
    };
  }, [dispatch]);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest || !isAuthChecked) return;

    if (!user) {
      void navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ingredientIds)).then((result) => {
      if (createOrder.fulfilled.match(result)) {
        dispatch(clearConstructor());
      }
    });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
      {orderError && (
        <Modal title="Ошибка" onClose={closeOrderModal}>
          <p className="text text_type_main-default pb-10">{orderError}</p>
        </Modal>
      )}
    </>
  );
};
