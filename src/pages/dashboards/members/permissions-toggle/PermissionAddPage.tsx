import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { useLayout } from '@/providers';
import { useAPIContext } from '@/auth/useAPIContext';
import { AxiosError, AxiosResponse } from 'axios';
import { isAxiosError } from '@/auth';
import { useParams } from 'react-router-dom';
import { AccountPermissionsNewContent } from './AccountPermissionsNewContent';

const PermissionAddPage = () => {
  const {get} = useAPIContext();
  const { id } = useParams<{ id: string }>();
  const [role, setRole] = useState<any|undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { currentLayout } = useLayout();
  useEffect(()=>{
    if(id)fetchRole(id);
  },[id])

 
  const fetchRole = async(id:string)=>{
    let role = {};
    let pageSize = 0
    const response = await get(`members/role/${id}`,'');
    if(isAxiosError(response)){
      const rs = response as AxiosError<any>;
      setError(`${rs.response?.data?.message}`);
      setTimeout(()=>{
        setError(null);
      },1200);

    } else {
      const rs = response as AxiosResponse<any>;
      role =rs?.data?.data;
      pageSize =rs?.data?.pageSize;
      setMessage(null);
      setTimeout(()=>{
        setError(null);
        setMessage(null);

        setRole(role);
      },800);
    }
   
  }

  return (
    <Fragment>
      <PageNavbar />

      {/* {currentLayout?.name === 'demo1-layout' && ( */}
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Overview of all team members and roles.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
          
              <Link to="/members/roles" className="btn btn-sm btn-light">
                Ver los roles
              </Link>
            </ToolbarActions>
          </Toolbar>
        </Container>
      {/* )} */}

      <Container>
        <AccountPermissionsNewContent />
      </Container>
    </Fragment>
  );
};

export { PermissionAddPage };
