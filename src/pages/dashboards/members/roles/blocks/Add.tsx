import { isAxiosError } from '@/auth';
import { useAPIContext } from '@/auth/useAPIContext';
import { CustomIcon, TGenericRequestParams } from '@/components';
import { toast } from 'sonner';
import { CardAddNew, CardRole } from '@/partials/cards';
import { AxiosError, AxiosResponse } from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import IconPickerModal from '@/components/IconPickerModal';
import { sanitizeText } from '@/utils';
import { useNavigate } from 'react-router-dom';


interface Badge {
  size: string;
  badge: ReactNode;
  fill: string;
  stroke: string;
}

interface IRolesItem {
  id:string;
  badge: Badge;
  title: string;
  subTitle: string;
  description: string;
  team: string;
  path: string;
}
interface IRolesItems extends Array<IRolesItem> {}

const Add = () => {
  const {post, processResponse} = useAPIContext();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isModalIconOpen, setIsIconModalOpen] = useState(false);
  const [name,setName] = useState('');
  const [title,setTitle] = useState('');
  const [icon,setIcon] = useState('');
  const [description,setDescription] = useState('');
  const [active,setActive] = useState(true);
  const [result, setResult] = useState<any|undefined>(undefined)
  const navigate = useNavigate();
  
  useEffect(()=>{
    if(result && result.id){
      navigate(`/members/role/${result.id}`, { replace: true });
    }
  },[result]);

  useEffect(()=>{
    if(title){
      setName(sanitizeText(title))
    }
  },[title])

  useEffect(()=>{
    if(error){
      toast(error, {
        description: message,
        action: {
          label: 'Aceptar',
          onClick: () => {

          }
        }
      });
    }
  },[error])

  const handleIconSelect = (icon:any) => {
    setIcon(icon);
    setIsIconModalOpen(false);
  };

  const handleSave = async () => {
    if (error) return;
    setSaving(true);
    try {
      const data = {
        name, 
        title,
        description, 
        icon,
        isActive:active
      }
      await handleSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el correo');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (data:any) =>{
    const response = await post(`members/role`,data);
    await processResponse({ response, setError, setMessage, setData:setResult });
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          Crear un nuevo Rol
          <a href="#" className="link">
            &nbsp; {name?`${name}`:''}
          </a>
        </h3>
      </div>
      <div className="card-body grid grid-cols-1 lg:grid-cols-1 gap-5 py-5 lg:py-7.5">
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Nombre</label>
            <input
              className="input"
              type="text"
              value={name}
              readOnly
              // onChange={(e) => setName(e.target.value)}
            />  
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Titlulo</label>
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />  
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">description</label>
            <input
              className="input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />  
          </div>
        </div>
        <div className="w-full">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56"></label>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsIconModalOpen(true)}>Choose Icon</button>
              {icon && <Icon icon={icon} width={40} height={40}   />}
              <IconPickerModal
                isOpen={isModalIconOpen}
                onClose={() => setIsIconModalOpen(false)}
                onSelect={handleIconSelect}
              />
          </div>
          <div className="flex items-center gap-2">
              <label className="switch">
                <input className="order-2" type="checkbox" value="1" name="check" defaultChecked={active} onClick={(e)=>{setActive(!active)}} />
                <span className="switch-label">
                  Activo:&nbsp;
                  <span className="switch-on:hidden">Off</span>
                  <span className="hidden switch-on:inline">On</span>
                </span>
              </label>
            </div>
        </div>
        </div>
        <div className="w-full">
        <div className="flex justify-end pt-2.5">
          <button 
            onClick={handleSave}
            disabled={!!error || saving }
            className="btn btn-primary">{saving ? 'Guardando...' : 'Save Changes'}</button>        
        </div>
        </div>
    </div>

  </div>
  );
};

export { Add };
