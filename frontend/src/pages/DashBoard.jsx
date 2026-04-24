
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import DashStats from '../components/dashboard/DashStats';
import ClientToggleSection from '../components/dashboard/ClientList';
import Notifications from '../components/dashboard/Notifications';
import Navbar from '../components/Navbar';
import ClientForm from "../components/forms/ClientForm";
import { getAllDashboardStats } from '@/lib/utils';

// notifications absolute toggle on mobile ?
function DashBoard() {
  const { user, data, success, SetSuccess, SetLoading, SetNewFetch, authRouter, authRouterForm } = useOutletContext();

  const dashboardStats = getAllDashboardStats(data.clients);

  return (
    <>
      <Navbar className="bg-white shadow" authRouter={authRouter} authRouterForm={authRouterForm} user={user} />
      <main className="flex justify-center px-4 py-6">
          <div className="w-full max-w-7xl flex">

            <div className="flex-1 w-full h-screen grid grid-cols-1 grid-rows-12 lg:grid-cols-4
              grid-rows-auto gap-4 md:p-4">
              <DashStats className="col-span-1 row-span-3 lg:row-span-2 lg:col-span-4" data={dashboardStats} />
              <ClientToggleSection className="border-border-400 bg-background-alt border-2 rounded-md col-span-1 lg:col-span-3 row-span-10"
              clientData={data.clients} authRouter={authRouter} authRouterForm={authRouterForm} />
              <Notifications className="border-border-400 shadow-md border-2 rounded-md col-span-1 lg:col-span-1 row-span-10" data={data} SetSuccess={SetSuccess} SetLoading={SetLoading} SetNewFetch={SetNewFetch} />
            </div>
          </div>
        </main>
      </>
  )
}

export default DashBoard;