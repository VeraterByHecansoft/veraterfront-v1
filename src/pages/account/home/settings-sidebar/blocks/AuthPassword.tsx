import { useAPIContext } from "@/auth/useAPIContext";
import { useEffect, useState } from "react";
import { delay } from '@/utils';

const AuthPassword = () => {
  const { put } = useAPIContext()
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [repeadPasswordInput, setRepeadPasswordInput] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

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
  }, [message]);

  useEffect(() => {
    if (!currentPasswordInput) {
      setError('Debes ingresar la contraseña actual.');
    } else {
      setError(undefined);
    }
  }, [currentPasswordInput]);

  useEffect(() => {
    if (repeadPasswordInput != passwordInput) {
      setError('La contraseña no coincide con la confirmación.');
    } else {
      setError(undefined);
    }
  }, [passwordInput, repeadPasswordInput]);

  const handleSetPassword = async () => {
    if (error) return;
    setSaving(true);
    try {
      await delay(200);
      await put('profile/email', { password: currentPasswordInput, newPassword: repeadPasswordInput }) as any;
      setMessage('Guardado');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña');
      setCurrentPasswordInput("");
      setPasswordInput("");
      setRepeadPasswordInput("");
    } 
  }

  return (
    <div className="card">
      <div className="card-header" id="auth_password">
        <h3 className="card-title">Contraseña</h3>
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
      <div className="card-body grid gap-5">
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Contraseña actual</label>
            <input
              className="input"
              type="password"
              value={currentPasswordInput}
              onChange={(e) => setCurrentPasswordInput(e.target.value)}
              placeholder="Contraseña Actual"
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Nueva contraseña</label>
            <input
              className="input"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Nueva contraseña"
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Confirmar contraseña</label>
            <input
              className="input"
              type="password"
              value={repeadPasswordInput}
              onChange={(e) => setRepeadPasswordInput(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2.5">
          <button
            onClick={handleSetPassword}
            disabled={!!error || saving}
            className="btn btn-primary">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </div>
      </div>
    </div>
  );
};

export { AuthPassword };
