
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { useEffect, useRef, useState } from 'react';
import { useAPIContext } from '@/auth/useAPIContext';
import { Icon } from '@iconify/react';
import IconPickerModal from '@/components/IconPickerModal';
import ColorPickerModal from '@/components/ColorPickerModal';
import { sanitizeText } from '@/utils';
import { IPermissionsEdit } from '../PermissionsTogglePage';
import { useNavigate } from 'react-router-dom';
interface PermissionsToggleProps {
  permision?:IPermissionsEdit;
}

type IParentPermision  = string|undefined;


const PermissionsToggleEdit = ({permision}:PermissionsToggleProps)  => {
  const {get,put, processResponse} = useAPIContext();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isModalIconOpen, setIsIconModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  const [isModule,setIsModule] = useState(true);
  const [items,setItems] = useState<any[]>([]);
  const [parentName,setParentName] = useState('');

  
 
  const [roleSelected,setRoleSelected] = useState('root');// -
  const [visible,setVisible] = useState(permision?.visible||false);
  const [title,setTitle] = useState(permision?.title||"");
  const [description,setDescription] = useState(permision?.description||"");
  const [color,setColor] = useState(permision?.color||"");
  const [icon,setIcon] = useState(permision?.icon||"");
  const [path,setPath] = useState(permision?.path||null)
  const [type,setType] = useState(permision?.parent||'root'); // ['module', 'operation', 'action','root']
  const [name,setName] = useState(sanitizeText(permision?.title||""));
  const [active,setActive] = useState(permision?.active);
  const [isRoot,setIsRoot] = useState(permision?.parent?false:true);//-
  const [parent,setParent] = useState(permision?.parent||null);
  // const navigate = useNavigate();
  useEffect(()=>{
    if(permision){
      fetchPermisions();
    }else{
      console.log('No hay role')
    }
  },[])

  useEffect(()=>{
    if(permision && items){
      setVisible(permision?.visible||false);
      setTitle(permision?.title||"");
      setDescription(permision?.description||"");
      setColor(permision?.color||"");
      setIcon(permision?.icon||"");
      setPath(permision?.path||null)
      setType(permision?.type||'root'); // ['module', 'operation', 'action','root']
      setName(sanitizeText(permision?.title||""));
      setActive(permision?.active);
      setIsRoot(permision?.parent?false:true);//-
      setParent(permision?.parent||null);
      setRoleSelected(permision?.parent||'root')
      getParentName(permision?.parent||'root');
    }
  },[items])

  useEffect(()=>{
      if(type === 'module'){
        setIsModule(true)
      }else{
        setIsModule(false)
        setPath(null)
      }
  },[type])
    
  useEffect(()=>{
    if(roleSelected == 'root'){
      setType('module');
      setParent(null);
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

  const fetchPermisions = async()=>{
    const response = await get(`members/permisions/`,'');
    await processResponse({ response, setError, setMessage, setData:setPermitionList });
  }
  const setPermitionList = (data:any)=>{
    if(data?.results){
      setItems(data.results);

    }
  }

  const handleIconSelect = (icon:any) => {
    setIcon(icon);
    setIsIconModalOpen(false);
  }

  const handleColorSelect = (color:any) => {
    setColor(color);
    setIsColorModalOpen(false);
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
        color,
        active
      }
      await handleSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el correo');
    } finally {
      setSaving(false);
    }
  }
  const handleSubmit = async (data:any) =>{
    const response = await put(`members/permision/${permision?._id}`,data);
    await processResponse({ response, setError, setMessage, setData:setResult });
  }
  const setResult=(data:any) =>{
    if(data){
      console.log('data',data)
    }
    setSaving(false);
  }
 
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          Editar Permiso
          <a href="#" className="link">
            &nbsp; {parentName?`${parentName}/`:''} {title}
          </a>
        </h3>
      </div>
      <div className="card-body grid grid-cols-1 lg:grid-cols-1 gap-5 py-5 lg:py-7.5">
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Tipo</label>
              <Select
                value={roleSelected}
                onValueChange={setRoleSelected}
                disabled={isRoot}
              >
              <SelectTrigger className="input" size="sm">
                <SelectValue placeholder={'selecciona perimos Raiz'} />
              </SelectTrigger>
              <SelectContent side="top" >
                  <SelectItem key={0} value={`root`}>
                    Root Module
                  </SelectItem>
                  {items?.map((item, index) => {
                    return <SelectItem  key={index} value={`${item._id}`}>
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
                disabled={isRoot}
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
              <button onClick={() => setIsColorModalOpen(true)}>Elige el color</button>
              {color && <div style={{background:color, width:40, height:40, borderRadius:5}}></div>}
              <ColorPickerModal
                isOpen={isColorModalOpen}
                onClose={() => setIsColorModalOpen(false)}
                onSelect={handleColorSelect}
              />
            </div>
            <div className="flex items-center gap-2">
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

export { PermissionsToggleEdit };

