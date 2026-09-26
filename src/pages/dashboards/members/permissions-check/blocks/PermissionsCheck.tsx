import { useEffect, useMemo, useState } from "react";
import { IPermissionsAPIItem, IRolesAPIItem } from "../../roles";
import { useAPIContext } from "@/auth/useAPIContext";
import { toast } from "sonner";
import { delay } from "@/utils";
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';


interface IPermissionsCheckItems extends Array<IPermissionsAPIItem> {}

interface PermissionsCheckProps {
  role:IRolesAPIItem;
}

interface PermissionItem {
  id:string
};

type PermissionItems  = Array<PermissionItem>

const PermissionsCheck = ({role}:PermissionsCheckProps) => {
  const {processResponse,put,post} = useAPIContext();
  const [permissions, setPermissions] = useState<IPermissionsCheckItems>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<any>(undefined);
    const navigate = useNavigate();
  useEffect(()=>{
    if (role?.permissions) {
      let selectedIds: string[] = [];
      let permissionsCheckItems: IPermissionsAPIItem[] = [];
      permissionsCheckItems = role.permissions.map((p: any) => {
        if(p?.checked){selectedIds.push(`${p._id}`)}
        if(p?.children){
          const children = p?.children.filter((c:any)=>c?.checked);
          const childrenIds = children.map((i:any)=>{
            return `${i._id}`
          })
          console.log('childrenIds',childrenIds)
          selectedIds = selectedIds.concat(childrenIds)
        }
        const item: IPermissionsAPIItem = {...p };
        return item;
      });
      setSelectedPermissions(selectedIds)
      setPermissions(permissionsCheckItems);
  }
  },[role])

  const permissionMap = useMemo(() => {
    const map: Record<string, IPermissionsAPIItem> = {};
    permissions.forEach((p) => {
      map[p._id] = p;
    });
    return map;
  }, [permissions]);

  const handleItemSelection = (target: EventTarget & HTMLInputElement) => {
    const checked = target.checked;
    const value = target.value;
    const isParent = permissionMap[value]?.children?.length > 0;   
    let newSelected = [...selectedPermissions];
    if (checked) {
      newSelected.push(value);
      if (isParent) {
        const childrenIds = permissionMap[value].children.map((c: any) => c._id);
        newSelected.push(...childrenIds);
      }
    } else {
      newSelected = newSelected.filter((id) => id !== value);
  
      if (isParent) {
        const childrenIds = permissionMap[value].children.map((c: any) => c._id);
        newSelected = newSelected.filter((id) => !childrenIds.includes(id));
      }
    }
  
    setSelectedPermissions([...new Set(newSelected)]);
  };
  
  const handleSave = async () => {
    if (error) return;
    setSaving(true);
    try {
      const data = {
        name: role.name,
        title:role.title,
        icon :role.icon,
        permissions:selectedPermissions,
        isActive:true,
      }
      await handleSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el correo');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (data:any) =>{

    await delay(200);
    const response = await put(`members/role/${role?._id}`,{...data});

    // const response = await post(,'');
    await processResponse({ response, setError, setMessage, setData:setResults });
  }

  useEffect(()=>{
    if(results){
      toast(`success`, {
        description: message,
        action: {
          label: 'Ok',
          onClick: () => console.log('Ok')
        }
      });
    }
  },[results])

  useEffect(()=>{
    if(error){
      toast(`Request Error`, {
        description: error,
        action: {
          label: 'Ok',
          onClick: () => {setError(null)}
        }
      });
    }
  },[error])

  const renderItem = (each: IPermissionsAPIItem, index: number) => {
    return (<tr key={index}>
      <td className="!py-5.5">
        {each.title} <span className="text-sm text-gray-400 font-medium px-2.5 hidden md:inline">{each?.path||''}</span>
        <button className="text-sm text-gray-400 font-medium px-2.5 hidden md:inline">
          <Icon icon="heroicons-outline:pencil-square" 
            className={`text-2xl text-brand`} onClick={()=>{ navigate(`/members/permision/${each._id}`)  }} />
          </button>
      </td>
      <td className="!py-5.5">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-start text-gray-300 font-normal min-w-[300px]">
                <input
                  value={each._id}
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selectedPermissions.includes(each._id)}
                  onChange={(e) => handleItemSelection(e.target)}
                />
              </th>
              {each?.children?.length>0?
              <th className="min-w-24 text-gray-700 font-normal text-center">
              <details className="group">
                <summary className="cursor-pointer list-none">
                  <span className="group-open:hidden">Ver {each?.children?.length} opciones más</span>
                  <span className="hidden group-open:inline">Ver menos</span>
                </summary>
                <div className="mt-2">
                  <table className="table w-full">
                    <tbody className="text-gray-900 font-medium">
                      {each.children.map((m:any, i:number) => (
                        <tr key={i}>
                          <td className="min-w-24 text-gray-700 font-normal text-center">
                            {each.title} <span className="text-sm text-gray-400 font-medium px-2.5 hidden md:inline">{m?.path||''}</span><br/>
                            <span className="text-sm text-gray-400 font-medium px-2.5 hidden md:inline">{m?.description||''}</span>
                            <button className="text-sm text-gray-400 font-medium px-2.5 hidden md:inline">
                              <Icon icon="heroicons-outline:pencil-square" 
                              className={`text-2xl text-brand`} onClick={()=>{ navigate(`/members/permision/${m._id}`)  }} />
                            </button>
                          </td>
                          <td className="text-start text-gray-300 font-normal min-w-[300px]">
                            <input
                              value={m._id}
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={selectedPermissions.includes(m._id)}
                              onChange={(e) => handleItemSelection(e.target)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </th>:<th className="min-w-24 text-gray-700 font-normal text-center"></th>
            }
              
            </tr>
          </thead>
        </table>
      </td>
    </tr>);
  };
  
  return (
    <div className="card">
 
      <div className="card-table scrollable-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="text-start text-gray-300 font-normal min-w-[300px]">Modulo</th>
              <th className="min-w-24 text-gray-700 font-normal text-center"></th>
            </tr>
          </thead>
          <tbody className="text-gray-900 font-medium">
            {permissions.map((each, index) => {
              return renderItem(each, index);
            })}
          </tbody>
        </table>
      </div>
      <div className="card-footer justify-end py-7.5 gap-2.5">
        <a href="#" className="btn btn-light btn-outline">
          Restore Defaults
        </a>
        <button 
            onClick={handleSave}
            disabled={!!error || saving }
            className="btn btn-primary">{saving ? 'Guardando...' : 'Save Changes'}</button> 
      </div>
    </div>
  );
};

export { PermissionsCheck, type IPermissionsCheckItems };


     {/* <div className="card-header gap-2">
        <h3 className="card-title">
          <a href="#" className="link">
          {role?.title||role?.name||'Known'}
          </a>
          &nbsp;{role?.name}<br/>
          <span className="text-sm text-gray-400 font-medium px-2.5 hidden md:inline">{role?.description||''}</span>
        </h3>
      </div> */}