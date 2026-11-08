import type { Location } from 'react-router-dom';

type TLocationState = {
  from?: {
    pathname: string;
  };
};

export const getReturnPath = (location: Location): string => {
  const state = location.state as TLocationState | null;
  return state?.from?.pathname ?? '/';
};
