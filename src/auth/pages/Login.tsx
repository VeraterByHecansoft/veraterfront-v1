import React,{ type MouseEvent, useEffect, useState,useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { CustomIcon } from '@/components/custom-icons';
import { useAuthContext } from '@/auth';
import { Alert } from '@/components';
import { toAbsoluteUrl } from '@/utils';

const loginSchema = Yup.object().shape({
  email: Yup.string()
//    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  remember: Yup.boolean()
});

const initialValuesPrd = {
  email: import.meta.env.VITE_DEV_USER?`${ import.meta.env.VITE_DEV_USER}`:'',
  password: import.meta.env.VITE_DEV_PASS?`${ import.meta.env.VITE_DEV_PASS}`:'',
  remember: false
};

  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('botonRef')
    }
  };


const Login = () => {
  const { login, user, error } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);




  useEffect(() => {
    if (user) {
      navigate('/panel', { replace: true });
    }
  }, [user]);

  const initialValues = initialValuesPrd;
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        if (!login) {
          throw new Error('AuthProvider is required for this form.');
        }
		values.email=values.email.includes('@verater.rute.mx')?values.email:values.email+'@verater.rute.mx'
        await login({ username: values.email, password: values.password })

        if (values.remember) {
          localStorage.setItem('email', values.email);
        } else {
          localStorage.removeItem('email');
        }
        setSubmitting(false);
        setLoading(false);
      } catch {
        console.error(error);
        setStatus('The sign up details are incorrect');
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  const togglePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
//      manejarClick();
    }
  };

  return (
    <div className="card max-w-[390px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="flex items-center gap-2 text-center">
          <span className="border-t  w-full"></span>
          <img
            src={toAbsoluteUrl('/media/app/mini-logo-primary-login.svg')}
            className="dark:hidden max-h-[60px]"
            alt="logo"
          />
          <img
            src={toAbsoluteUrl('/media/app/mini-logo-primary-dark.svg')}
            className="hidden dark:inline-block max-h-[60px]"
            alt="logo"
          />
          <span className="border-t  w-full"></span>
        </div>
        <div className="flex items-center gap-2 text-center">
          <span className="text-gray-500 font-medium w-full">Ingresar</span>
        </div>
        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Usuario</label>
          <label className="input">
            <input
              placeholder="Enter username"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.email && formik.errors.email
              })}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <label className="form-label text-gray-900">Contraseña</label>
            <Link
              to={
                '/auth/reset-password'
              }
              className="text-2sm link shrink-0"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <label className="input">
            <input
              onKeyDown={manejarEnter}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              autoComplete="off"
              {...formik.getFieldProps('password')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.password && formik.errors.password
              })}
            />
            <button className="btn btn-icon" onClick={togglePassword}>
              <CustomIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
              <CustomIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showPassword })}
              />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>
        {error?.message && (
          <span role="alert" className="text-danger text-xs mt-1">
            {error?.message}
          </span>
        )}
        <label className="checkbox-group">
          <input
            className="checkbox checkbox-sm"
            type="checkbox"
            {...formik.getFieldProps('remember')}
          />
          <span className="checkbox-label">Recordarme</span>
        </label>

        <button
          ref={botonRef}
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Please wait...' : 'Ingresar a mi panel'}
        </button>
      </form>
    </div>
  );
};

export { Login };
