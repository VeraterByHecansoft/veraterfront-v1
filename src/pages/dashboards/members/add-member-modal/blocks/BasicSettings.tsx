import { CrudAvatarUpload } from '@/partials/crud';
import { useEffect, useState } from 'react';
import { delay } from '@/utils';
import { IImageInputFile } from '@/components/image-input';
import { useAPIContext } from '@/auth/useAPIContext';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { generalSettings } from '@/config';

interface BasicSettingsProps {
  onSave?: () => void,
  member?: any | undefined
}

const BasicSettings = ({ onSave, member }: BasicSettingsProps) => {
  const { post, put } = useAPIContext();
  const [avatar, setAvatar] = useState<IImageInputFile | undefined>(undefined);
  const [avatarP, setAvatarP] = useState<string | undefined>(undefined);

  const [nombre, setNombre] = useState('');
  const [apellidoP, setApellidoP] = useState('');
  const [apellidoM, setApellidoM] = useState('');
  const [cel, setCel] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('');
  const [sexo, setSexo] = useState('');
  const [password, setPassword] = useState('');
  const [repeadPassword, setRepeadPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast(`Request Error`, {
        description: error,
        action: {
          label: 'Ok',
          onClick: () => { setError(null) }
        }
      });
      setSaving(false);
    }
  }, [error])

  const handleSubmit = async (data: any) => {
    try {
      await delay(500);
      setSaving(false);
      if (member) {
        put(`/member/${member.USR}`, data).then((response: any) => {
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
      } else {
        post('/member', data).then((response: any) => {
          const data = response?.data
          if (data.success) {
            const user = data.user;
            toast(`Registro Exitoso`, {
              description: message,
              action: {
                label: 'Ok',
                onClick: () => {
                  navigate(`/member/${user.USR}`, { replace: true });
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
      }

    } catch (err: any) {
      setSaving(false);
      setError(`${err.response || err}`)
    }
  };

  const handleSave = async () => {
    if (error) return;
    setSaving(true);
    try {
      const data = {
        nombres: nombre,
        APP: apellidoP,
        APM: apellidoM,
        cel,
        usr: usuario,
        email,
        tipo,
        sexo,
        password,
        PSW: repeadPassword,
        perfil: '1'
      }
      await handleSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el correo');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeAvatar = (files: IImageInputFile[]) => {
    if (files.length == 1) {
      setAvatar(files[0]);
    }
  }
  useEffect(() => {
    if (member) {
      setNombre(member.NOMBRE)
      setApellidoP(member.APP)
      setApellidoM(member.APM)
      setCel(member.cel)
      setUsuario(member.USR)
      setEmail(member.email)
      setTipo(member.tipo)
      setSexo(member.sexo)
    }
  }, [member])
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="basic_settings">
        <h3 className="card-title">Datos del miembro</h3>
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
      <div className="card-body grid md:grid-cols-4 gap-6">
        <div className="flex items-center flex-wrap md:col-span-4">
          <label className="form-label max-w-56">Avatar</label>
          <div className="flex items-center justify-between flex-wrap grow gap-2.5">
            <span className="text-2sm text-gray-700">150x150px JPEG, PNG imágen</span>
            <CrudAvatarUpload dataURL={avatarP} onChangeAvatar={handleChangeAvatar} />
          </div>
        </div>
        <div className="flex flex-col md:col-span-4">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">{/* Agregar lellenda de formato*/}
            <label className="form-label flex items-center gap-1 max-w-56">Nombre de usuario</label>
            <input
              className="input"
              type="text"
              value={usuario}
              readOnly={member?.USR}
              onChange={(e) => {
                // Filtrar y formatear el valor
                const formattedValue = e.target.value
                  .toLowerCase()        // Convertir a minúsculas
                  .replace(/\s+/g, '')  // Eliminar espacios
                  .replace(/[^a-z0-9]/g, ''); // Eliminar caracteres especiales

                setUsuario(formattedValue);
              }}
              pattern="[a-z0-9]+"  // Validación HTML5
              title="Solo letras (a-z) y números (0-9), sin espacios"
            />
          </div>
        </div>
        <div className="flex flex-col md:col-span-4">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Nombre</label>
            <input
              className="input"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col  md:col-span-4">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Apellido Paterno</label>
            <input
              className="input"
              type="text"
              value={apellidoP}
              onChange={(e) => setApellidoP(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col md:col-span-4">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Apellido Materno</label>
            <input
              className="input"
              type="text"
              value={apellidoM}
              onChange={(e) => setApellidoM(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col md:col-span-2">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Número de Movil</label>
            <input
              className="input"
              type="text"
              value={cel}
              onChange={(e) => setCel(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col md:col-span-2">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Correo de recuperación</label>
            <input
              className="input"
              type="email"
              value={email}
              readOnly={member!=undefined}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col md:col-span-2">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Nivel de acceso</label>
            <Select
              value={tipo}
              onValueChange={setTipo}
            >
              <SelectTrigger className="input" size="sm">
                <SelectValue placeholder={'selecciona un rol'} />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value='member'>Miembro</SelectItem>
                <SelectItem value='admin'> Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col md:col-span-2">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Sexo</label>
            <Select
              value={sexo}
              onValueChange={setSexo}
            >
              <SelectTrigger className="input" size="sm">
                <SelectValue placeholder={'selecciona el sexo'} />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value='H'>Hombre</SelectItem>
                <SelectItem value='M'>Mujer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col md:col-span-4">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Empresa</label>
            <input
              className="input"
              type="text"
              readOnly
              value={generalSettings.company_name}
            />
          </div>
        </div>

        {!member&&<div className="flex flex-col md:col-span-2">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Contraseña</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
              name="fakepass"
              autoComplete="off"
            />
          </div>
        </div>}
        {!member&&<div className="flex flex-col md:col-span-2">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Confirmar contraseña</label>
            <input
              className="input"
              type="password"
              value={repeadPassword}
              onChange={(e) => setRepeadPassword(e.target.value)}
              placeholder="Confirm new password"
              name="fakepass2"
              autoComplete="off"
            />
          </div>
        </div>}
        <div className="flex flex-col md:col-span-4">
          <div className="flex justify-end pt-2.5 ">
            <button
              onClick={handleSave}
              disabled={!!error || saving}
              className="btn btn-primary">{saving ? 'Guardando...' : 'Save Changes'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BasicSettings };
