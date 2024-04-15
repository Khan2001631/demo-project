import { useEffect, FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateLogin, updateLogout } from '../api-integration/commonSlice';
import PropTypes from 'prop-types';

interface GuestGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<GuestGuardProps> = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
    isLoggedIn ? dispatch(updateLogin()) : dispatch(updateLogout());
  }, []);
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  if (isLoggedIn) {
    return <>{children}</>;
  }

  return <Navigate to='/login' />;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;