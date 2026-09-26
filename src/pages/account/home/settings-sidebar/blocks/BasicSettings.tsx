import { CrudAvatarUpload } from '@/partials/crud';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/auth';
import { delay, toAbsoluteUrl } from '@/utils';
import { IImageInputFile } from '@/components/image-input';
import { useAPIContext } from '@/auth/useAPIContext';
import { toast } from "sonner";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/contexts/store';
import { updateUserData } from '@/contexts/store/slicers/authSlice';

const BasicSettings = () => {
  const { user } = useAuthContext();
  const { put } = useAPIContext()
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState<IImageInputFile | undefined>(undefined);
  const [avatarP, setAvatarP] = useState<string | undefined>(undefined);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [lastNamePInput, setLastNamePInput] = useState('');
  const [lastNameMInput, setLastNameMInput] = useState('');
  const [phoneInput, sePhoneInput] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
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
    if (user) {
      setNameInput(user?.NOMBRE || '??')
      setLastNamePInput(user?.APP || '??')
      setLastNameMInput(user?.APM || '??')
      setEmailInput(user?.email || '??');
      sePhoneInput(user?.cel || '??');
      const avatar = user?.imgperf ? `https://rute.mx/D?u=${user.imgperf}&t=1` : toAbsoluteUrl(`/media/avatars/${'blank.png'}`)
      setAvatarP(avatar);
    }
  }, [user])

  const handleSubmit = async (data: any) => {
    try {
      setSaving(true);
      const response = await put('/profile', data) as any
      const _data = response?.data;
      if (_data?.success) {
        const { APM,
          APP,
          EMP,
          NOMBRE,
          cel } = _data
        dispatch(updateUserData({
          APM,
          APP,
          EMP,
          NOMBRE,
          cel
        }))
      }
      setMessage('Guardado');
    } catch (error: any) {
      setError(`${error.message || error}`)
    }
  };

  function imageToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
  const handleSave = async () => {
    if (error) return;
    let _avatar = '';
    if (avatar?.file) {
      const b64 = await imageToBase64(avatar.file) as string
      _avatar = b64;
    }
    try {
      const data = {
        NOMBRE: nameInput,
        APP: lastNamePInput,
        APM: lastNameMInput,
        cel: phoneInput,
        imgperf: _avatar
      }
      handleSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar tus datos.');
      setSaving(false);
    }
  };

  const handleChangeAvatar = (files: IImageInputFile[]) => {
    if (files.length == 1) {
      setAvatar(files[0]);
    }
  }
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="basic_settings">
        <h3 className="card-title">Mis datos</h3>
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
        <div className="flex items-center flex-wrap gap-2.5">
          <label className="form-label max-w-56">Avatar</label>
          <div className="flex items-center justify-between flex-wrap grow gap-2.5">
            <span className="text-2sm text-gray-700">150x150px JPEG, PNG Image</span>
            <CrudAvatarUpload dataURL={avatarP} onChangeAvatar={handleChangeAvatar} />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Nombre</label>
            <input
              className="input"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Apellido Paterno</label>
            <input
              className="input"
              type="text"
              value={lastNamePInput}
              onChange={(e) => setLastNamePInput(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Apellido Materno</label>
            <input
              className="input"
              type="text"
              value={lastNameMInput}
              onChange={(e) => setLastNameMInput(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">No. Celular</label>
            <input
              className="input"
              type="text"
              placeholder="Enter phone"
              value={phoneInput}
              onChange={(e) => sePhoneInput(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Permisos</label>
            <input
              className="input"
              type="text"
              readOnly={true}
              value={user?.tipo}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Email</label>
            <input
              className="input"
              type="text"
              readOnly={true}
              value={emailInput}
            />
          </div>
        </div>
        <div className="flex justify-end pt-2.5">
          <label className="form-label max-w-56">
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
          </label>
          <button
            onClick={handleSave}
            disabled={!!error || saving}
            className="btn btn-primary">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </div>
      </div>
    </div>
  );
};

export { BasicSettings };
