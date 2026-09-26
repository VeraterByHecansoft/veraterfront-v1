import { Fragment, useState } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { AddMemberModal } from '../add-member-modal/AddMemberModal';
import { Button } from '@mui/base';
import { TablaMembers } from './blocks/member-table';
import { useAuthContext } from '@/auth';
import { Navigate } from 'react-router';
import { useAPIContext } from '@/auth/useAPIContext';
import { toast } from "sonner";

const MembersPage = () => {
  const { user } = useAuthContext()
  const { put } = useAPIContext();
  if (!['admin', 'owner'].includes(`${user?.tipo}`)) {
    return <Navigate to="/panel" replace />;
  }
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [triger, setTriger] = useState('none');
  const [member, setMember] = useState<any | undefined>(undefined);

  const handleSettingsModalClose = () => {
    setSettingsModalOpen(false);
    handleTriger();
    setMember(undefined)
  };

  const handleTriger = () => {
    setTriger('load');
    setTimeout(() => {
      setTriger('none');
    }, 500)
  }

  const handleOnEdit = (user: any) => {
    setSettingsModalOpen(true);
    setMember(user)
  }

  const handleOnBlock = (user: any) => {
    put(`member/block/${user.USR}`, { block: 'desactivar' })
      .then((response: any) => {
        toast(`Usuario Bloqeado`, {
          description: 'OK',
          action: {
            label: 'Ok',
            onClick: () => {
              handleTriger()
            }
          }
        });
        handleTriger()
      })
  }

  const handleOnInvite = (user: any) => {
    put(`member/sendActiva/${user.USR}`, { usr: user.USR })
      .then((response: any) => {
        toast(`Recuperación enviada`, {
          description: 'OK',
          action: {
            label: 'Ok',
            onClick: () => {
              handleTriger()
            }
          }
        });
        handleTriger()
      })
  }

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Descripción general de todos los miembros y roles del equipo.</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button className="btn btn-sm btn-light" onClick={() => { setSettingsModalOpen(true) }}>
              Agregar miembro
            </Button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          <TablaMembers triger={triger} onEdit={handleOnEdit} onBlock={handleOnBlock} onInvite={handleOnInvite} />
        </div>
      </Container>
      <Container>
        <AddMemberModal member={member} open={settingsModalOpen} onOpenChange={handleSettingsModalClose} />
      </Container>
    </Fragment>
  );
};

export { MembersPage };
