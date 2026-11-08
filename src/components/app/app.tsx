import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import { ProtectedRoute } from '@components/protected-route';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIsIngredientsLoading,
} from '@services/slices/ingredients-slice';
import { checkUserAuth } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';

import type { AppContentProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const formatOrderNumber = (value: string | undefined): string =>
  `#${String(value ?? '').padStart(6, '0')}`;

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: Location } | null)?.background;

  const closeModal = (): void => {
    void navigate(background?.pathname ?? '/');
  };

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderPage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/feed/:number" element={<OrderModal onClose={closeModal} />} />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderModal onClose={closeModal} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

const IngredientPage = (): React.JSX.Element => (
  <div className={styles.detailPageWrap}>
    <h1 className={`${styles.detailHeader} text text_type_main-large`}>
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </div>
);

const OrderPage = (): React.JSX.Element => {
  const { number } = useParams();

  return (
    <div className={styles.detailPageWrap}>
      <p className={`${styles.detailHeader} text text_type_digits-default`}>
        {formatOrderNumber(number)}
      </p>
      <OrderInfo />
    </div>
  );
};

const OrderModal = ({ onClose }: { onClose: () => void }): React.JSX.Element => {
  const { number } = useParams();

  return (
    <Modal title={formatOrderNumber(number)} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};
