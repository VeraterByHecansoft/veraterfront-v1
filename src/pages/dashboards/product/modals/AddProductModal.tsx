import { useEffect, useRef, useState } from 'react';
import { Scrollspy, TGenericRequestParams } from '@/components';

import { useResponsive, useViewport } from '@/hooks';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { AddProductSidebar } from './AddProductSidebar';
import { useAPIContext } from '@/auth/useAPIContext';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { IImageInputFile } from '@/components/image-input';
import { ExtraAttrEditor } from './TExtraAttr';
import { InventoryEditor } from './InventoryEditor';

interface IModalProfileProps {
  open: boolean;
  onOpenChange: () => void;
}
type TOption = {
  label: string;
  value: string;
};
interface IItemSelects extends Array<TOption> {}

type TExtraAttr = {
  key: string;
  value: string;
  description: string;
}

type TInventory = {
  warehouse:string;
  quantity:number
}

const AddProductModal = ({ open, onOpenChange }: IModalProfileProps) => {
  const {get,postMultipart, processResponseDirect,processResponse} = useAPIContext()
  const desktopMode = useResponsive('up', 'lg');
  const navBar = useRef<any | null>(null);
  const parentRef = useRef<any | null>(null);
  const [sidebarHeight, setSidebarHeight] = useState<number>(0);
  const [viewportHeight] = useViewport();
  const offset = 260;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [name,setName] = useState("")
  const [sku,setSku] = useState("")
  const [barcode,setBarcode] = useState("")
  const [description,setDescription] = useState("")
  const [price,setPrice] = useState("")
  const [cost,setCost ]= useState("")
  const [category,setCategory] = useState("")
  const [brand,setBrand] = useState("")
  const [unit,setUnit] = useState("")
  const [taxRate,setTaxRate] = useState('')
  const [image,setImage ] = useState<IImageInputFile | undefined>(undefined);
  const [attributes, setAtributes ] = useState<Array<TExtraAttr>  | []>([]);

  // const [attributes: [attributeSchema],
  const [active, setActive] = useState(true);

  useEffect(() => {
    setSidebarHeight(viewportHeight - offset);
  }, [viewportHeight]);

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
      
      if (image?.file) {
        formData.append('image', image?.file);
      }

      const response = await postMultipart('/product',formData);
      await processResponse({ response, setError, setMessage, setData:loadSuccess });

    } catch (err: any) {
      setSaving(false);
      setError(`${err.response || err}`)
    }
  };
  const loadSuccess = (data:any)=>{
    if(data)onOpenChange()
  }

  const fetchCategories = async (query:string) =>  {
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);
    const response = await get(`product/categories`,`${queryParams.toString()}`);
    const data = await processResponseDirect ({ response});
    if(data?.results && data?.results.length>0){
      const results = data.results.map((c: any) => ({ value: c._id, label: c.name }));
      return  [...results]
    }else{
      return []
    }
  }

  const fetchUnits = async (query:string) =>  {
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);
    const response = await get(`product/units`,`${queryParams.toString()}`);
    const data = await processResponseDirect ({ response});
    if(data?.results && data?.results.length>0){
      const results = data.results.map((c: any) => ({ value: c._id, label: c.name }));
      return  [...results]
    }else{
      return []
    }
  }

  const fetchBrands = async (query:string) =>  {
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);
    const response = await get(`product/brands`,`${queryParams.toString()}`);
    const data = await processResponseDirect ({ response});
    if(data?.results && data?.results.length>0){
      const results = data.results.map((c: any) => ({ value: c._id, label: c.name }));
      return  [...results]
    }else{
      return []
    }
  }

  const fetchWarehouses = async (query:string) =>  {
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);
    const response = await get(`warehouse`,`${queryParams.toString()}`);
    const data = await processResponseDirect ({ response});
    if(data?.results && data?.results.length>0){
      const results = data.results.map((c: any) => ({ value: c._id, label: c.name }));
      return  [...results]
    }else{
      return []
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">Nuevo producto</h1>
              <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
                Agregar Nuevo producto
              </div>
            </div>
            <button className="btn btn-sm btn-light" onClick={onOpenChange}>
              Cerrar
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
          <div className="flex grow gap-5 lg:gap-7.5">
            {desktopMode && (
              <div className="block w-[230px] shrink-0">
                <div
                  ref={navBar}
                  className="w-[230px] fixed z-10 scrollable-y-auto"
                  style={{ maxHeight: `${sidebarHeight}px` }}
                >
                  <Scrollspy offset={100} targetRef={parentRef}>
                    <AddProductSidebar />
                  </Scrollspy>
                </div>
              </div>
            )}
            <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
              <div className="card pb-2.5">
                  <div className="card-header" id="basic_settings">
                    <h3 className="card-title">Datos Basicos</h3>
                  </div>
                  <div className="card-body grid gap-5">
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
                        <label className="form-label flex items-center gap-1 max-w-56">Categoria</label>
                                <SearchableSelect
                                  value={category||""}
                                  onValueChange={setCategory}
                                  placeholder="Selecciona La Categoría"
                                  fetchOptions={fetchCategories}
                                />
                        </div>
                    </div>
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label flex items-center gap-1 max-w-56">Marca</label>
                                <SearchableSelect
                                  value={brand||""}
                                  onValueChange={setBrand}
                                  placeholder="Selecciona La Marca"
                                  fetchOptions={fetchBrands}
                                />
                        </div>
                    </div>
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label flex items-center gap-1 max-w-56">Unidad</label>
                                <SearchableSelect
                                  value={unit||""}
                                  onValueChange={setUnit}
                                  placeholder="Selecciona La Unidad"
                                  fetchOptions={fetchUnits}
                                />
                        </div>
                    </div>
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label flex items-center gap-1 max-w-56">sku</label>
                          <input
                            className="input"
                            type="text"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                          /> 
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label flex items-center gap-1 max-w-56">barcode</label>
                          <input
                            className="input"
                            type="text"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                          /> 
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label flex items-center gap-1 max-w-56">Costo</label>
                          <input
                            className="input"
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                          /> 
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label flex items-center gap-1 max-w-56">Precio</label>
                          <input
                            className="input"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
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
           

                  </div>
                  <div className="card-header"  id="extra_attr">
                    <h3 className="card-title">Atributos Extra</h3>
                  </div>
                  <div className="card-body grid gap-5">
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label flex items-center gap-1 max-w-56"></label>
                          <ExtraAttrEditor
                        initial={attributes}
                        onChange={setAtributes}
                      />
                    </div>
                  </div>
                  </div>
                  <div className="card-header"  id="inventore_attrs">
                    <h3 className="card-title">Inventario</h3>
                  </div>
                  <div className="card-body grid gap-5">
                  <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label flex items-center gap-1 max-w-56"></label>
                          <InventoryEditor
                            initial={[{ warehouse: '', quantity: 0 }]}
                            fetchWarehouses={fetchWarehouses}
                            // SearchableSelect={SearchableSelect}
                            onChange={(items) => {
                              console.log('Inventario actualizado:', items);
                            }}
                          />
                      </div>
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

export { AddProductModal };
