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
import { useLayout } from '@/providers';
import { PermissionsCheck } from '../permissions-check';
import { useParams } from 'react-router';
import { useAPIContext } from '@/auth/useAPIContext';
import { IRolesAPIItem } from './blocks';
import { Link } from 'react-router-dom';

const RolesViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const {processResponse, get} = useAPIContext();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [role, setRole] = useState<any>(undefined);
  const { currentLayout } = useLayout();
  
  const fetchRole = async(id:string)=>{
     let role = {};
     let pageSize = 0
     const response = await get(`members/role/${id}`,'');
     await processResponse({ response, setError, setMessage, setData:setRole });
  
  }
  useEffect(()=>{
    id?fetchRole(id):()=>{};
  },[id])

  useEffect(()=>{
    if(role){
      const R = role as IRolesAPIItem
      R.permissions
    }
  },[role])
 
  return (
    <Fragment>
      {/* <PageNavbar /> */}
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text={`${role?.title||role?.name||'Known'}`} />
            <ToolbarDescription>{role?.description}</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Link to={`/members/permision`} className="btn btn-sm btn-light">
              Crear un Permiso para un rol
            </Link>
            {role?.tmembers <= 0?
              <Link to='#' className="btn warning btn-sm btn-light">
                  Eliminar  Rol {role?.tmembers}
              </Link>
              :null
            }
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
       <PermissionsCheck role={role} />
      </Container>
    </Fragment>
  );
};

export { RolesViewPage };
