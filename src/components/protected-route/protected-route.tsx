import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '@services/slices/user-slice';
import { useSelector } from '@services/store';
import { getReturnPath } from '@utils/location';

import type { ReactElement } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps): ReactElement => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={getReturnPath(location)} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};
