import { useAuthContext } from '@/auth';
import { useAPIContext } from '@/auth/useAPIContext';
import { delay } from '@/utils';
import { useEffect, useRef, useState } from 'react';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { updateUserData } from '@/contexts/store/slicers/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/contexts/store';

const emailRegex = /^\S+@\S+\.\S+$/;

const AuthEmail = () => {
  const { user } = useAuthContext();
  const { put, } = useAPIContext()
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setSaving(false);
        setMessage(undefined);
        setError(undefined);
      }, 1800)
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setSaving(false);
        setMessage(undefined);
        setError(undefined);
      }, 1800)
    }
  }, [message])

  useEffect(() => {
    if (!emailInput) {
      setError('El email es obligatorio.');
    } else if (!emailRegex.test(emailInput)) {
      setError('Por favor ingresa un correo válido.');
    } else {
      setError(undefined);
    }
  }, [emailInput]);

  const handleSave = async () => {
    if (error) return;
    setModalOpen(true);
  };

  const handleSetPassword = async (password: string) => {
    if (error) return;
    setSaving(true);
    try {
      await delay(200);
      const response = await put('profile/email', { email: emailInput, password }) as any;
      const _data = response?.data;
      if (_data?.success) {
        const { email } = _data
        dispatch(updateUserData({
          email
        }))
      }
      setMessage('Guardado');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el correo de recuperación.');
      setSaving(false);
    } finally {
      setSaving(false);
    }
  }

  const handleCancelPassword = async () => {
    setSaving(false);
    setMessage(undefined);
    setError(undefined);
  }

  return (
    <div className="card pb-2.5">
      {<PasswordProm saving={saving} error={error || ''} message={message || ''} open={modalOpen} onOpenChange={handleCancelPassword} onAceptChange={handleSetPassword} />}
      <div className="card-header" id="auth_email">
        <h3 className="card-title">Email</h3>
      </div>
      <div className="card-body grid gap-5 pt-7.5">
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Email</label>
            <div className="flex flex-col tems-start grow gap-7.5 w-full">
              <input
                className="input"
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              {error && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {error}
                </span>
              )}
              {message && (
                <span role="alert" className="text-success text-xs mt-1">
                  {message}
                </span>
              )}
              <span className="form-info text-gray-800 text-2sm font-normal">
                Introduce tu correo electrónico y configúralo como principal para recibir actualizaciones prioritarias.
                <br /> Cambia para personalizar fácilmente tus preferencias de comunicación.
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={!!error || saving || emailInput === user?.email}
            className="btn btn-primary">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
          {error && (
            <span role="alert" className="text-danger text-xs mt-1">
              {error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export { AuthEmail };

interface IModalProfileProps {
  open: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
  onOpenChange: () => void;
  onAceptChange: (data: string) => void;
}

const PasswordProm = ({ open, saving, error, message, onOpenChange, onAceptChange }: IModalProfileProps) => {
  const [passwordInput, setPasswordInput] = useState('');
  const parentRef = useRef<any | null>(null);

  const handleSave = () => {
    onAceptChange(passwordInput);
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="container-fixed max-w-[200px] flex flex-col p-10 overflow-hidden [&>button]:hidden">
      <DialogHeader className="p-0 border-0">
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
          <div className="flex flex-col justify-center gap-2">
            <h1 className="text-xl font-semibold leading-none text-gray-900">Ingresa tu contraseña</h1>
            <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
              Por seguridad, es necesario validar tu contraseña antes de cambiar el correo.
            </div>
            {error && (
              <span role="alert" className="text-danger text-xs mt-1">
                {error}
              </span>
            )}
            {message && (
              <span role="alert" className="text-success text-xs mt-1">
                {message}
              </span>
            )}
          </div>
          <button className="btn btn-sm btn-light" onClick={onOpenChange}>
            Cancelar
          </button>
        </div>
      </DialogHeader>
      <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
        <div className="card-body grid gap-5">
          <div className="w-full">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <input
                className="input"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>
            <div className="flex justify-end pt-2.5">
              <button
                onClick={handleSave}
                disabled={!!error || saving}
                className="btn btn-primary">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </div>
        </div>
      </DialogBody>
    </DialogContent>
  </Dialog>

}