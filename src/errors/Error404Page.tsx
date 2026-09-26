import useBodyClasses from '@/hooks/useBodyClasses';
import { toAbsoluteUrl } from '@/utils';
import { handleItemSelection } from '@mui/base/useList';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

const Error404Page = () => {
  useBodyClasses('dark:bg-coal-500');
  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || '/';
  const handleBack = () => {
    navigate('/', { replace: true });
  }
  return (
    <Fragment>
      <div className="mb-10">
        <img
          src={toAbsoluteUrl('/media/illustrations/19.svg')}
          className="dark:hidden max-h-[160px]"
          alt="image"
        />
        <img
          src={toAbsoluteUrl('/media/illustrations/19-dark.svg')}
          className="light:hidden max-h-[160px]"
          alt="image"
        />
      </div>

      <span className="badge badge-primary badge-outline mb-3">404 Error</span>

      <h3 className="text-2.5xl font-semibold text-gray-900 text-center mb-2">
        Ups, Hemos perdido esta pagina
      </h3>

      <div className="text-md text-center text-gray-700 mb-10">
        Falta la página solicitada. Verifique la URL o&nbsp;
        <a href="" onClick={handleBack} className="text-primary font-medium hover:text-primary-active">
          Regresar al inicio
        </a>
        .
      </div>
    </Fragment>
  );
};

export { Error404Page };
