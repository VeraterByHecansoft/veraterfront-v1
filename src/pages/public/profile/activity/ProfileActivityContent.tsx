import { useEffect, useState } from 'react';
import { UserType } from '@/types/authTypes';
import { useAPIContext } from '@/auth/useAPIContext';
import { Outlet } from 'react-router';
import { Movsoperatios } from '../blocks/stp/Movsoperatios';

interface ProfileActivityContentProps {
  user?: UserType
}

const ProfileActivityContent = ({ user }: ProfileActivityContentProps) => {

  if(!user){
    return <Outlet/>
  }

  return (
    <Movsoperatios CLABE={user.CLABE || ''} />
  );

};

export { ProfileActivityContent };
