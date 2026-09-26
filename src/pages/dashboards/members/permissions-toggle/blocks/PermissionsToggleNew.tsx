import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { useEffect, useState } from 'react';
import { useAPIContext } from '@/auth/useAPIContext';
import { Icon } from '@iconify/react';
import IconPickerModal from '@/components/IconPickerModal';
import ColorPickerModal from '@/components/ColorPickerModal';
import { sanitizeText } from '@/utils';
import { toast } from 'sonner';
import { idDatabaseValidationError } from '@/contexts/api/APIProvider';
import { useNavigate } from 'react-router-dom';

interface IPermissionsToggleItem {
  parent?:string;//
  type?:string;
  icon:string;//
  name?:string;//
  title:string;//
  description:string;//
  color?:string;//
  order?:number;//
  path?:string;//
  visible?:boolean;
  active?:boolean;//
  createdAt?:string;
  updatedAt?:string;
  checked?: boolean;//
  _id?:string;
}

interface IPermissionsToggleItems extends Array<IPermissionsToggleItem> {}
interface IPermissionsToggle {
  description:string;
  isActive:boolean;
  name:string;
  createdAt:string;
  updatedAt:string;
  permissions?:IPermissionsToggleItems;
  _id:string
}

type IParentPermision  = string|undefined;

const PermissionsToggleNew = () => {
  const {get, post, processResponse} = useAPIContext();
  const [items, setItems] = useState<IPermissionsToggleItems>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isModalIconOpen, setIsIconModalOpen] = useState(false);

  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  const [roleSelected,setRoleSelected] = useState('root');// Parent
  const [parent,setParent] = useState<IParentPermision>(undefined);
  const [parentName,setParentName] = useState('');
  const [type,setType] = useState('root'); // ['module', 'operation', 'action']
  const [name,setName] = useState('');
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [icon,setIcon] = useState('');
  
  const [visible,setVisible] = useState(true);
  const [order,setOrder] = useState('0');
  const [color,setColor] = useState('blue');
  const [active,setActive] = useState(true);
  const [path,setPath] = useState<string |null >(null);
  const [isModule,setIsModule] = useState(true);
const navigate = useNavigate();
  
  
  const handleIconSelect = (icon:any) => {
    setIcon(icon);
    setIsIconModalOpen(false);
  };
  const handleColorSelect = (color:any) => {
    setColor(color);
    setIsColorModalOpen(false);
  };

  useEffect(()=>{
    if(error){
      if (idDatabaseValidationError(error)) {   
        toast.warning('Error de validación', {
          style:{background:'#FFCCCC',color:'#FFF'},
          description: Object.values(error.errors)
            .map((err) => `${err.path}: ${err.message}`)
            .join('\n'),
            duration: 10000,
        });
      }else{
        toast.warning('Ocurrió un error', {
          description:error,
          duration: 10000,
        });
      }
    }
    setSaving(false);
  },[error]);

  
  useEffect(()=>{
    fetchPermisions();
  },[]);
  useEffect(()=>{
    if(roleSelected == 'root'){
      setType('module');
      setParent(undefined);
    }else{
      setParent(roleSelected);
    }
    getParentName(roleSelected)
  },[roleSelected])

  useEffect(()=>{
    if(title){
      setName(sanitizeText(title))
    }
  },[title])

  useEffect(()=>{
    if(type === 'module'){
      setIsModule(true)
    }else{
      setIsModule(false)
      setPath(null)
    }
  },[type])

  const fetchPermisions = async()=>{
    const response = await get(`members/permisions/`,'');
    await processResponse({ response, setError, setMessage, setData:setResultItems,timeOut:1500 });
  }

  const setResultItems=(data:any) =>{
    if(data?.results){
      setItems(data?.results)
    }
  }
  
  const getParentName = (id:string)=>{
    if(id =='root' ){
      setParentName('')
    }else{
      const R = items?.filter((item)=>item._id == id);
      if(R[0]){
        setParentName(R[0].title)
      }
    }
  }



  const handleSave = async () => {
    if (error) return;
    setSaving(true);
    try {
      const data = {
        parent,
        type,
        name,
        title,
        description,
  
        icon,
        visible,
        order,
        color,
        active
      }
      await handleSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el correo');
      setSaving(false);
    } 
  };

  const handleSubmit = async (data:any) =>{
    const response = await post(`members/permision`,data);
    await processResponse({ response, setError, setMessage, setData:setResult });
  }
  const setResult=(data:any) =>{
    if(data?._id){
      navigate(`/members/permision/${data?._id}`)
    }
    setSaving(false);
  }
 
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          Crear un nuevo permiso
          <a href="#" className="link">
            &nbsp; {parentName?`${parentName}/`:''} {title}
          </a>
        </h3>
      </div>
      <div className="card-body grid grid-cols-1 lg:grid-cols-1 gap-5 py-5 lg:py-7.5">

        
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Permiso Padre</label>
              <Select
                value={roleSelected}
                onValueChange={setRoleSelected}
              >
              <SelectTrigger className="input" size="sm">
                <SelectValue placeholder={'selecciona perimos Raiz'} />
              </SelectTrigger>
              <SelectContent side="top">
                  <SelectItem key={0} value={`root`}>
                    Root Module
                  </SelectItem>
                  {items.map((item, index) => {
                    return <SelectItem key={index} value={`${item._id}`}>
                    {item?.title}
                    </SelectItem>
                  })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Tupo</label>
              <Select 
                value={type}
                onValueChange={setType}
              >
              <SelectTrigger className="input" size="sm">
                <SelectValue placeholder={'selecciona perimos Raiz'} />
              </SelectTrigger>
              <SelectContent side="top">
                  <SelectItem key={0} value={`module`}>
                    Modulo
                  </SelectItem>
                  <SelectItem key={1} value={`operation`}>
                    Operación
                  </SelectItem>
                  <SelectItem key={2} value={`action`}>
                    Accion
                  </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Nombre</label>
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
            <label className="form-label flex items-center gap-1 max-w-56">Descripcion</label>
            <input
              className="input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />  
          </div>
        </div>
        {isModule &&(
          <div className="w-full">
           <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
             <label className="form-label flex items-center gap-1 max-w-56">path</label>
             <input
               className="input"
               type="text"
               value={path||''}
               onChange={(e) => setPath(e.target.value)}
             />  
           </div>
          </div>
        )}
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56"></label>
            <div className="flex items-center gap-2">
              <label className="switch">
                <input className="order-2" type="checkbox" value="1" name="check" defaultChecked={visible} onClick={(e)=>{setVisible(!visible)}} />
                <span className="switch-label">
                  Es visible:&nbsp;
                  <span className="switch-on:hidden">Off</span>
                  <span className="hidden switch-on:inline">On</span>
                </span>
              </label>
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
            <div className="flex items-center gap-2">
            {isModule && ( <span role="alert" className="text-danger text-lg mt-1">* </span> )}
              <button onClick={() => setIsColorModalOpen(true)}>Elige el color</button>
              {color && <div style={{background:color, width:40, height:40, borderRadius:5}}></div>}
              <ColorPickerModal
                isOpen={isColorModalOpen}
                onClose={() => setIsColorModalOpen(false)}
                onSelect={handleColorSelect}
              />
              
            </div>
            <div className="flex items-center gap-2">
            {isModule && ( <span role="alert" className="text-danger text-lg mt-1">* </span> )}
              <button onClick={() => setIsIconModalOpen(true)}>Choose Icon</button>
              {icon && <Icon icon={icon} width={40} height={40} color={color}  />}
              <IconPickerModal
                isOpen={isModalIconOpen}
                onClose={() => setIsIconModalOpen(false)}
                onSelect={handleIconSelect}
              />
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

export { PermissionsToggleNew, type IPermissionsToggleItem, type IPermissionsToggleItems, type IPermissionsToggle };

