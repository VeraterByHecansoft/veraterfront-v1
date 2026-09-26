import { useAPIContext } from "@/auth/useAPIContext";
import { delay } from "@/utils";
import { toast } from "sonner";
import { useEffect, useState } from "react";
interface AuthPasswordProps {
  onSave?: () => void,
  member?: any | undefined
}


const AuthPassword = ({ member,onSave }: AuthPasswordProps) => {
  const { put } = useAPIContext()
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [repeadPasswordInput, setRepeadPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentPasswordInput) {
      setError('Debes ingregsar la contraseña actual.');
    } else {
      setError(null);
    }
  }, [currentPasswordInput]);

  useEffect(() => {
    if (repeadPasswordInput != passwordInput) {
      setError('La contraseña no coincide con la confirmación.');
    } else {
      setError(null);
    }
  }, [passwordInput, repeadPasswordInput]);

  const handleSetPassword = async () => {
    if (error) return;
    setSaving(true);
    try {
      setSaving(true);
      await delay(200);
      const formData = new FormData();
      formData.append('password', currentPasswordInput);
      formData.append('newPassword', repeadPasswordInput);
      const params = {
        adminPassword: currentPasswordInput,
        newpassword: passwordInput,
        repeatpassword: repeadPasswordInput
      }

      put(`member/pass/${member.USR}`, params).then((response: any) => {
        const data = response?.data
        if (data.success) {
          toast(`Registro Exitoso`, {
            description: message,
            action: {
              label: 'Ok',
              onClick: () => {
                onSave?.()
              }
            }
          });
          setTimeout(() => {
            onSave?.()
          }, 800)
        } else {
          setError(data.message)
        }
        setSaving(false);
      })

    } catch (err: any) {
      setError(err.message || 'Error al actualizar el correo');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="card-header" id="auth_password">
        <h3 className="card-title">Password</h3>
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
            <label className="form-label max-w-56">Contraseña (admin)</label>
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
            className="btn btn-primary">{saving ? 'Guardando...' : 'Save Changes'}</button>

        </div>
      </div>
    </div>
  );
};

export { AuthPassword };
