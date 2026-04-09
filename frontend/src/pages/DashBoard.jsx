
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import DashStats from '../components/dashboard/DashStats';
import ClientList from '../components/dashboard/ClientList';
import Notifications from '../components/dashboard/Notifications';

function DashBoard() {
  const { user, data, success, SetSuccess, SetLoading, SetNewFetch, authRouter, authRouterForm } = useOutletContext();

  return (
    <div className='contentWrapper'>
      <DashStats data={data} />
      <ClientList data={data} />
      <Notifications data={data} SetSuccess={SetSuccess} SetLoading={SetLoading} SetNewFetch={SetNewFetch}/>
    </div>
  )
}

export default DashBoard;