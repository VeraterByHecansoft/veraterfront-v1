import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';
import {LoadingScreen} from '@/components/loaders/LoadingScreen';


const RequireAuth = () => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <Outlet /> : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export { RequireAuth };
