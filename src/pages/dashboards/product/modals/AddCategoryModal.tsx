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
import { SearchableSelect } from '@/components/ui/SearchableSelect';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
}


const AddCategoryModal = ({ open, onOpenChange }: IModalProfileProps) => {
  const {get,} =  useAPIContext()
  const {post,processResponseDirect,processResponse} = useAPIContext()
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [categories, setCategories] = useState<any|undefined>(undefined);
  const [name, setName]= useState("")
  const [description,setDescription]= useState("")
  const [parentCategory, setParentCategory ] = useState<string|null>('root')
  const [active, setActive] = useState(true);

  const fetchCategories = async (query:string) =>  {
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);
    const response = await get(`product/categories`,`${queryParams.toString()}`);
    const data = await processResponseDirect ({ response});
    if(data?.results && data?.results.length>0){
      const results = data.results.map((c: any) => ({ value: c._id, label: c.name }));
      console.log("results",results)
      return  [...results,{value:'root',label:'Categoria Raiz'}]
    }else{
      return []
    }
  }

  const handleSave = async () => {
    if (error) return;
    setSaving(true);
    try {
      const data = {
        name, 
        parent:parentCategory,
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

  const handleSubmit = async (data:any) =>{
    const response = await post(`product/category`,data);
    await processResponse({ response, setError, setMessage, setData:(data)=>{if(data) onOpenChange()} });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">Nueva categoría</h1>
              <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
                Agregar Nuevo 
              </div>
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
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label flex items-center gap-1 max-w-56">Padre</label>
                        <SearchableSelect
                          value={parentCategory||""}
                          onValueChange={setParentCategory}
                          placeholder="Selecciona La categoría Padre"
                          fetchOptions={fetchCategories}
                        />
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

export { AddCategoryModal };
