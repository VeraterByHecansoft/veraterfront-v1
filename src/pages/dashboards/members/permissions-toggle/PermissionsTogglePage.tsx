import { Fragment, useEffect, useState } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

// import { AccountPermissionsToggleContent } from '../permissions-toggle';
import { useLayout } from '@/providers';
import { useAPIContext } from '@/auth/useAPIContext';
import { AxiosError, AxiosResponse } from 'axios';
import { isAxiosError } from '@/auth';
import { Link, useParams } from 'react-router-dom';
import { AccountPermissionsNewContent } from './AccountPermissionsNewContent';
import { AccountPermissionsEditContent } from './AccountPermissionsEditContent';
export interface IPermissionsEdit {
  _id:string;
  active:boolean;
  color:string| null;
  description:string| null;
  icon:string| null;
  isRoot:boolean| null;
  name:string;
  order:string;
  parent:string|null;
  path:string;
  title:string;
  type:string;
  visible:boolean
}
const PermissionsTogglePage = () => {
  const {get, processResponse} = useAPIContext();
  const { id } = useParams<{ id: string }>();
  const [permision, setPermision] = useState<IPermissionsEdit|undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { currentLayout } = useLayout();

  useEffect(()=>{
    if(id)fetchRole(id);
  },[])

 
  const fetchRole = async(id:string)=>{
    const response = await get(`members/permision/${id}`,'');
    await processResponse ({ response, setError, setMessage, setData:loadData});
  }
  const loadData = (data:any) =>{
    setPermision(data)
  }

  return (
    <Fragment>
      <PageNavbar />

      {/* {currentLayout?.name === 'demo1-layout' && ( */}
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={permision?.title} />
              <ToolbarDescription>{permision?.description}</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Link to="/members/roles" className="btn btn-sm btn-light">
                Ver los ver los roles
              </Link>
            </ToolbarActions>
          </Toolbar>
        </Container>
      {/* )} */}

      <Container>
        {permision && (<AccountPermissionsEditContent permision={permision} />)}
      </Container>
    </Fragment>
  );
};

export { PermissionsTogglePage };
