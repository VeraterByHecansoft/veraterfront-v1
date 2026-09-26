import { useAuthContext } from "@/auth";
import { FormattedMessage } from "react-intl";
import { CustomIcon, Menu, MenuItem, MenuLink, MenuTitle, MenuToggle } from '@/components';
import { DropdownUserMedatada } from '@/partials/dropdowns/general';
import { useLanguage } from "@/i18n";
import { useEffect, useState } from "react";
import { Container } from "lucide-react";
import { AccountSettingsModal } from "@/pages/account/home/settings-modal";
interface IAboutTable {
  status: string;
  info: string;
}
interface IAboutTables extends Array<IAboutTable> {}

const AboutPublic = ({metadata}:any) => {
  const [tables, setTables] = useState<IAboutTables | []>([]);
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(()=>{
    (async()=>{
      if(metadata){
        const birthDate = metadata?.BirthDate
        let age = null;
        if(birthDate){
          const timestampActual = Date.now();
          const diferencia = timestampActual - birthDate;
          age = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25));
        }

        const tables: IAboutTables = [
          { status: 'Age', info: `${age}` },
          { status: 'City:', info: metadata?.City||'??' },
          { status: 'State:', info: metadata?.State||'??'},
          { status: 'Country:', info: metadata?.Country||'??' },
          { status: 'Postcode:', info: metadata?.Postcode||'??'},
          { status: 'Phone:', info: metadata?.phone||'??' },
          {
            status: 'Email:',
            info: `<a href="#" class="text-gray-800 hover:text-primary-active">${metadata?.email}</a>`
          }
        ]
        setTables(tables);
      }    
    })()
  },[metadata])

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
          <FormattedMessage id="UI.HEADERS.USERDATA" />
        </h3>
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
    </div>
  );
};

export { AboutPublic, type IAboutTable, type IAboutTables };
