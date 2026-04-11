
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import DashStats from '../components/dashboard/DashStats';
import ClientList from '../components/dashboard/ClientList';
import Notifications from '../components/dashboard/Notifications';

// notifications absolute toggle on mobile ?
function DashBoard() {
  const { user, data, success, SetSuccess, SetLoading, SetNewFetch, authRouter, authRouterForm } = useOutletContext();

  return (
    <div className="flex-1 w-full h-screen grid grid-cols-1 grid-rows-10 md:grid-cols-4
      grid-rows-auto gap-4 p-4">
      <DashStats data={data} className="col-span-1  md:col-span-4 row-span-2" />
      <ClientList data={data} className="col-span-1 md:col-span-3 row-span-8" />
      <Notifications className="col-span-1 md:col-span-1 row-span-10" data={data} SetSuccess={SetSuccess} SetLoading={SetLoading} SetNewFetch={SetNewFetch} />
    </div>
  )
}

export default DashBoard;