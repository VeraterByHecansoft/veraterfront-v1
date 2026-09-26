import { useAuthContext } from "@/auth";
import { FormattedMessage } from "react-intl";
import { CustomIcon, Menu, MenuItem, MenuLink, MenuTitle, MenuToggle } from '@/components';
import { useEffect, useState } from "react";
import { Container } from "lucide-react";
import { AccountSettingsModal } from "@/pages/account/home/settings-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
interface IAboutTable {
  status: string;
  info: string;
}
interface IAboutTables extends Array<IAboutTable> {}

const About = () => {
  const { user} = useAuthContext();
  const [tables, setTables] = useState<IAboutTables | []>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadMetadata = async()=>{ 
    if(user){
      const tables: IAboutTables = [
        { status: 'CLABE', info: user?.CLABE||'??' },
        { status: 'Tipo:', info: user?.tipo||'??'},
      ]
      setTables(tables);
    }  
  }
  useEffect(()=>{
    loadMetadata();
  },[])
  
  const renderTable = (table: IAboutTable, index: number) => {
    return (
      <tr key={index}>
        <td className="text-sm text-gray-600 pb-3.5 pe-3">{table.status}</td>
        <td
          className="text-sm text-gray-900 pb-3.5"
          dangerouslySetInnerHTML={{ __html: table.info }}
        />
      </tr>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
        <FormattedMessage id="UI.HEADERS.MYDATA" />
        </h3>
        <Menu>
          <MenuItem onClick={()=>{setModalOpen(true)}}>
            <MenuLink>
              <MenuTitle>Editar</MenuTitle>
              <CustomIcon icon="edit" />
            </MenuLink>
          </MenuItem>
        </Menu>
      </div>

      <div className="card-body pt-4 pb-3">
        <table className="table-auto">
          <tbody>
            {tables.map((table, index) => {
              return renderTable(table, index);
            })}
          </tbody>
        </table>
      </div>
      <Container>
        <AccountSettingsModal open={modalOpen} onOpenChange={()=>{setModalOpen(false)}} />
      </Container>
    </div>
  );
};

export { About, type IAboutTable, type IAboutTables };
