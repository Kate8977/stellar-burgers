import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const { pathname } = useLocation();
  const isConstructorActive = pathname === '/' || pathname.startsWith('/ingredients');
  const isFeedActive = pathname.startsWith('/feed');
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            end
            className={`${styles.link} pl-5 pr-5 mr-2 ${
              isConstructorActive ? styles.link_active : ''
            }`}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>
          <NavLink
            to="/feed"
            className={`${styles.link} pl-5 pr-5 ${isFeedActive ? styles.link_active : ''}`}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>
        <Link to="/" className={styles.logo}>
          <Logo className="" />
        </Link>
        <NavLink
          to="/profile"
          className={`${styles.link} ${styles.link_position_last} pl-5 ${
            isProfileActive ? styles.link_active : ''
          }`}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className="text text_type_main-default ml-2">
            {userName ?? 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
