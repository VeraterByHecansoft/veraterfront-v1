import clsx from 'clsx';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuthContext } from '@/auth/useAuthContext';
import { Alert, CustomIcon } from '@/components';
const initialValues = { email: '' };
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Formato de correo electrónico incorrecto')
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 symbols')
    .required('Se requiere correo electrónico')
});

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { requestPasswordResetLink } = useAuthContext();
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        await requestPasswordResetLink(values.email);
        setMessage('success')
      } catch (err: any) {
        if (err.message) {
          setStatus(err.message);
          setError(err.message);
        } else {
          setStatus('Error al restablecer la contraseña. Inténtalo de nuevo.');
          setError('Error al restablecer la contraseña. Inténtalo de nuevo.');
        }
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Correo de recuperación</h3>
          <span className="text-2sm text-gray-600 font-medium">
            Ingresa tu correo electrónico para restablecer la contraseña
          </span>
        </div>

        {error && <Alert variant="danger">{formik.status}</Alert>}

        {!error && message && (
          <Alert variant="success">
            Se envió el enlace para restablecer la contraseña. Por favor, revise su correo electrónico para continuar.
          </Alert>
        )}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              type="email"
              placeholder="email@email.com"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email
                }
              )}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5 items-stretch">
          <button
            type="submit"
            className="btn btn-primary flex justify-center grow"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? 'Espere por favor...' : 'Continuar'}
          </button>

          <Link
            to={'/auth/login'}
            className="flex items-center justify-center text-sm gap-2 text-gray-700 hover:text-primary"
          >
            <CustomIcon icon="black-left" />
            Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </div>
  );
};

export { ResetPassword };
