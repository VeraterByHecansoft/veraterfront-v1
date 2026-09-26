import { isAxiosError } from '@/auth';
import { useAPIContext } from '@/auth/useAPIContext';
import { CustomIcon, TGenericRequestParams } from '@/components';
import { toast } from 'sonner';
import { CardAddNew, CardRole } from '@/partials/cards';
import { AxiosError, AxiosResponse } from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from '@/providers';
import { Icon } from '@iconify/react';
import { size } from 'lodash';
import secureStore from '@/contexts/store/persistConfig';

interface Badge {
  size: string;
  badge: ReactNode;
  fill: string;
  stroke: string;
}

interface IPermissionsAPIItem {
  _id:string;
  active:boolean;
  checked:boolean;
  path: string;
  color: string;
  createdAt: string;
  description: string;
  icon: string;
  name: string;
  order: string;
  parent: string;
  title: string;
  type: string;
  updatedAt: string;
  visible:boolean;
  children:Array<IRolesAPIItem> []
}

interface IRolesAPIItem {
  _id:string;
  createdAt: string;
  updatedAt: string;
  description: string;
  isActive:boolean;
  true:boolean;
  name: string;
  title?: string;
  icon?: string;
  permissions:Array<IPermissionsAPIItem> []
}


interface IRolesItem {

  id:string;
  badge: Badge;
  name: string;
  title: string;
  description: string;
  icon:string
  isActive:boolean;
}
interface IRolesItems extends Array<IRolesItem> {}

const Roles = () => {
  const { pathname, prevPathname } = usePathname();
  const {get, processResponse} = useAPIContext();
  const storageFilterId = 'roles-filter';
  const [searchQuery, setSearchQuery] = useState(() => {return secureStore.getItem(storageFilterId) || '';});
  const [items, setItems] = useState<IRolesItems>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const fetchRoles = async (params?: TGenericRequestParams) => {
    try {
      const queryParams = new URLSearchParams();
      if(params){
        queryParams.set('page', String( params?.pageIndex?params?.pageIndex + 1:1)); // Page is 1-indexed on server
        queryParams.set('limit', String(params.pageSize));
  
        if (params.sorting?.[0]?.id) {
          queryParams.set('sort', params.sorting[0].id);
          queryParams.set('order', params.sorting[0].desc ? 'desc' : 'asc');
        }
  
        if (searchQuery.trim().length > 0) {
          queryParams.set('query', searchQuery);
        }
  
        // Column filters
        if (params.filters) {
          params.filters.forEach(({ id, value }) => {
            if (value !== undefined && value !== null) {
              queryParams.set(`filter[${id}]`, String(value)); // Properly serialize filter values
            }
          });
        }
      }

      const response = await get('members/roles',`${queryParams.toString()}`);
      await processResponse ({ response, setError, setMessage, setData:loadData});

    } catch (error) {
      toast(`Connection Error`, {
        description: `An error occurred while fetching data. Please try again later`,
        action: {
          label: 'Ok',
          onClick: () => console.log('Ok')
        }
      });
      setItems([]);
    }
  };

  const loadData = (data:any) =>{

    if(data?.results){
      setItems(data.results);
    }
  }

  const renderItem = (item: IRolesItem, index: number) => {
    const badge = { 
        size: item?.badge?.size || 'size-[60px]',
        badge:<Icon icon={item.icon} className={`text-2xl text-brand`} />,
        stroke:item?.badge?.stroke||"stroke-brand-clarity",
        fill:item?.badge?.fill||"fill-light"
    }
    return (
      <CardRole
        key={index}  
        id={item.id}
        name={item?.name}
        title={item?.title}
        description={item?.description}
        badge={badge}
        onEdit={handleEdit}
        onDetails={handleDetails} 
        onExport={handleExport}
      />
    );
  };

  useEffect(()=>{
    fetchRoles();
  },[pathname])


  const handleEdit = (id:string)=>{
    // fetchRole(id).then((res)=>{
      
    // })
  } 
  const handleDetails= (id:string)=>{
    // fetchRole(id).then((res)=>{
      
    // })
  } 
  const handleExport= (id:string)=>{
    // fetchRole(id).then((res)=>{

    // })
  } 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
      {items.map((item, index) => {
        return renderItem(item, index);
      })}
      <CardAddNew
        path="/members/role"
        size="size-[60px]"
        iconSize="text-2xl"
        title="nuevo roll"
        subTitle="Agregar un nuevo role de usuario"
      />
    </div>
  );
};

export { Roles, type IRolesItem, type IRolesItems, type IRolesAPIItem, type IPermissionsAPIItem };
