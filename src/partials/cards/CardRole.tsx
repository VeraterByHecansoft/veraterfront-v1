import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { Icon } from '@iconify/react';
import { DropdownCardItem1 } from '../dropdowns/general';

import { CommonHexagonBadge } from '../common';
import { ReactNode } from 'react';
import { DropdownCardItemRole } from '../dropdowns/general/DropdownCardItemRole';

interface Badge {
  size: string;
  badge: ReactNode;
  fill: string;
  stroke: string;
}

interface IRoleProps {
  id: string;
  badge: Badge;
  name?: string;
  title: string;
  description: string;
  onEdit?:(id: string)=>void, 
  onDetails?:(id: string)=>void, 
  onExport?:(id: string)=>void, 
}


const CardRole = ({ id, name='', title,  description, badge,  onEdit=undefined, onDetails=undefined, onExport=undefined }: IRoleProps) => {
  const { isRTL } = useLanguage();

  const handleEdit = ()=>{
    if(onEdit)onEdit(id);
  } 
  const handleDetails= ()=>{
    if(onDetails)onDetails(id);
  } 
  const handleExport= ()=>{
    if(onExport)onExport(id);
  } 

  return (
    <div className="card flex flex-col gap-5 p-5 lg:p-7.5">
      <div className="flex items-center flex-wrap justify-between gap-1">
        <div className="flex items-center gap-2.5">
          <CommonHexagonBadge {...badge} />

          <div className="flex flex-col">
            <Link
              to={`/members/role/${id}`}
              className="text-md font-medium text-gray-900 hover:text-primary-active mb-px"
            >
              {title}
            </Link>
            <span className="text-2sm text-gray-700">{name}</span>
          </div>
        </div>

        <Menu className="inline-flex">
          <MenuItem
            toggle="dropdown"
            trigger="click"
            dropdownProps={{
              placement: isRTL() ? 'bottom-start' : 'bottom-end',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: isRTL() ? [0, -10] : [0, 10] // [skid, distance]
                  }
                }
              ]
            }}
          >
            <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
              <Icon icon="dots-vertical" />
            </MenuToggle>
            {DropdownCardItemRole({onEdit:handleEdit, onDetails:handleDetails, onExport:handleExport})}
            
          </MenuItem>
        </Menu>
      </div>

      <p className="text-2sm text-gray-700">{description}</p>

      {/* <span className="text-2sm text-gray-800">{subTitle}</span> */}
    </div>
  );
};

export { CardRole, type IRoleProps };
