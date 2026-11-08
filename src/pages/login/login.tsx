import { LoginUI } from '@ui-pages';
import { useState, type SyntheticEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUser, selectLoginError } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';
import { getReturnPath } from '@utils/location';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorText = useSelector(selectLoginError);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(loginUser({ email, password })).then((result) => {
      if (loginUser.fulfilled.match(result)) {
        void navigate(getReturnPath(location), { replace: true });
      }
    });
  };

  return (
    <LoginUI
      errorText={errorText ?? undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
