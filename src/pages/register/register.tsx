import { RegisterUI } from '@ui-pages';
import { useState, type SyntheticEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { registerUser, selectRegisterError } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';
import { getReturnPath } from '@utils/location';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorText = useSelector(selectRegisterError);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(registerUser({ name: userName, email, password })).then((result) => {
      if (registerUser.fulfilled.match(result)) {
        void navigate(getReturnPath(location), { replace: true });
      }
    });
  };

  return (
    <RegisterUI
      errorText={errorText ?? undefined}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
