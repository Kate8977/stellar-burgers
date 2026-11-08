import type { Location } from 'react-router-dom';

type TLocationState = {
  from?: {
    pathname: string;
  };
};

/** Куда вернуть пользователя после входа. Если он никуда не шёл — на главную. */
export const getReturnPath = (location: Location): string => {
  const state = location.state as TLocationState | null;
  return state?.from?.pathname ?? '/';
};
