


import { ISaldos } from '@/partials/heros/types';
import { MovsoperatiosMember } from './blocks/stp/MovsoperatiosMember';
import { UserType } from '@/types/authTypes';

const MembersAccountPageContent = ({user,saldos}:{user:UserType, saldos:ISaldos}) => {
  return (
    <MovsoperatiosMember user={user} saldos={saldos}/>
  );

};

export { MembersAccountPageContent };
