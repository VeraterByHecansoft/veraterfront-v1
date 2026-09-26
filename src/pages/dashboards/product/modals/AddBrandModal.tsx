import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { useAPIContext } from '@/auth/useAPIContext';
import { useState } from 'react';
import { IImageInputFile } from '@/components/image-input';
import { CrudAvatarUpload } from '@/partials/crud';
import { CrudImageUpload } from '@/components/ui/CrudImageUpload';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
}


const AddBrandModal = ({ open, onOpenChange }: IModalProfileProps) => {
  const {postMultipart,processResponse} = useAPIContext()
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);


  const [name, setName]= useState("")
  const [logo, setLogo] = useState<IImageInputFile | undefined>(undefined);
  const [description,setDescription]= useState("")
  const [active, setActive] = useState(true);

  const handleSave = async () => {
    if (error) return;
    setSaving(true);
    try {
      const data = {
        name,
        description, 
        isActive:active
      }
      await handleSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el correo');
    } finally {
      setSaving(false);
    }
  };


  const handleSubmit = async (data:any) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key)=>{
        formData.append(key, data[key]);
      })
      
      if (logo?.file) {
        formData.append('image', logo?.file);
      }

      const response = await postMultipart('/product/brand',formData);
      await processResponse({ response, setError, setMessage, setData:loadSuccess });

    } catch (err: any) {
      setSaving(false);
      setError(`${err.response || err}`)
    }
  };
  
  const handleChangeImage = (files: IImageInputFile[]) =>{
    if(files.length==1){
      setLogo(files[0]);
    }
  }
  const loadSuccess = (data:any)=>{
    if(data)onOpenChange()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <DialogTitle>Nueva Marca</DialogTitle>
              <DialogDescription>Agregar una nueva </DialogDescription>
            </div>
            <button className="btn btn-sm btn-light" onClick={!saving?onOpenChange:()=>{}}>
              Cerrar
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" >
          <div className="flex grow gap-5 lg:gap-7.5">
            <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
                <div className="card pb-2.5">
                  <div className="card-header" id="basic_settings">
                    <h3 className="card-title">Datos</h3>
                  </div>
                  <div className="card-body grid gap-5">
                    <div className="flex items-center flex-wrap gap-2.5">
                          <label className="form-label max-w-56">Imagen</label>
                          <div className="flex items-center justify-between flex-wrap grow gap-2.5">
                            <span className="text-2sm text-gray-700">150x150px JPEG, PNG Image</span>
                            <CrudImageUpload  onChangeImage={handleChangeImage} />
                          </div>
                    </div>
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label flex items-center gap-1 max-w-56">Nombre</label>
                          <input
                            className="input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          /> 
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label flex items-center gap-1 max-w-56">Description</label>
                          <input
                            className="input"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          /> 
                      </div>
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
                    <div className="flex justify-end pt-2.5">
                      <button 
                        onClick={handleSave}
                        disabled={!!error || saving }
                        className="btn btn-primary">{saving ? 'Guardando...' : 'Save Changes'}</button>        
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AddBrandModal };
