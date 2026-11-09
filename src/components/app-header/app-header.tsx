import { AppHeaderUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { selectUser } from '@services/slices/user-slice';
import { useSelector } from '@services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);
  const { pathname } = useLocation();

  return (
    <AppHeaderUI
      userName={user?.name}
      isConstructorActive={pathname.startsWith('/ingredients')}
    />
  );
};
