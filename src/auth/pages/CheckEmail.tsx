import { Link, useSearchParams } from 'react-router-dom';

import { toAbsoluteUrl } from '@/utils';
import { useEffect, useState } from 'react';
import { useAPIContext } from '../useAPIContext';

const CheckEmail = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>('Verificando parametros...');
  const [loading, setLoading] = useState<boolean>(true);
  const [procesando, setProcesando] = useState<boolean>(false);
  const email = searchParams.get('email');
  const token = searchParams.get('tk');
  const { post, get } = useAPIContext();
  console.log({ email, token });

  const senValidation = async () => {
    if(procesando)return;
    setProcesando(true)
    setMessage('Validando...');
    try {
      if (email && token) {
        const E = await post('auth/validate-email', { email, token });
        console.log(E)
        setMessage('Verificación exitosa');
        setLoading(false)
        setError(undefined)
      } else {
        setError('No se ha podido verificar la cuenta');
        setLoading(false)
      }
    } catch (err: any) {
      setMessage(undefined);
      if (err.message) {
        setError(err.message || 'Known error');
      } else {
        setError('Error al restablecer la contraseña. Inténtalo de nuevo.');
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    senValidation();
  }, [])



  return (
    <div className="card max-w-[440px] w-full">
      <div className="card-body p-10">
        <div className="flex justify-center py-10">
          <img
            src={toAbsoluteUrl('/media/illustrations/30.svg')}
            className="dark:hidden max-h-[130px]"
            alt=""
          />
          <img
            src={toAbsoluteUrl('/media/illustrations/30-dark.svg')}
            className="light:hidden max-h-[130px]"
            alt=""
          />
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-3">Verificación de cuenta</h3>
        {loading ?
          <>
            <div className="text-2sm text-center text-gray-700 mb-7.5">
              {message}
            </div>
          </> :
          <>{error ?
            <div className="text-2sm text-center text-gray-700 mb-7.5">
              Ha ocurrido un error con la verificación&nbsp;
              <a href="#" className="text-2sm text-gray-900 font-medium hover:text-primary-active">
                {email || 'No se encontró el correo de verificación'}
              </a>
              <br />
              {error}
            </div>
            :
            <div className="text-2sm text-center text-gray-700 mb-7.5">
              {message}&nbsp;
              <Link to="/auth/login" className="text-2sm text-gray-900 font-medium hover:text-primary-active">
                Iniciar sesión
              </Link>
              <br />

            </div>
          }
          </>}
      </div>
    </div>
  );
};

export { CheckEmail };
