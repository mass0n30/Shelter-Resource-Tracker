
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import DashStats from '../components/dashboard/DashStats';
import ClientList from '../components/dashboard/ClientList';
import Notifications from '../components/dashboard/Notifications';
import Navbar from '../components/Navbar';
import ClientForm from "../components/forms/ClientForm";

// notifications absolute toggle on mobile ?
function DashBoard() {
  const { user, data, success, SetSuccess, SetLoading, SetNewFetch, authRouter, authRouterForm } = useOutletContext();

  const [toggle, SetToggle] = useState(true);
  const [toggleForm, SetToggleForm] = useState(false);

  return (
    <>
      <Navbar className="bg-white shadow" authRouter={authRouter} authRouterForm={authRouterForm} />
      <main className="flex justify-center px-4 py-6">
          <div className="w-full max-w-7xl flex">

            {toggleForm && (
              <ClientForm
                SetToggleForm={SetToggleForm}
                authRouter={authRouter}
                authRouterForm={authRouterForm}
              />
            )}

            <div className="flex-1 w-full h-screen grid grid-cols-1 grid-rows-10 md:grid-cols-4
              grid-rows-auto gap-4 p-4">
              <DashStats className="col-span-1  md:col-span-4 row-span-2" />
              <ClientList className="border-border-400 border-2 rounded-md col-span-1 md:col-span-3 row-span-8"
              clientData={data.clients} />
              <Notifications className="border-border-400 border-2 rounded-md col-span-1 md:col-span-1 row-span-10" data={data} SetSuccess={SetSuccess} SetLoading={SetLoading} SetNewFetch={SetNewFetch} />
            </div>
          </div>
        </main>
      </>
  )
}

export default DashBoard;