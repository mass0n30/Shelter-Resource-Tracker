
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import DashStats from '../components/dashboard/DashStats';
import ClientToggleSection from '../components/dashboard/ClientList';
import Notifications from '../components/dashboard/Notifications';
import NotificationsAlert from '../components/dashboard/NotificationsAlert';
import Navbar from '../components/Navbar';
import { getAllDashboardStats, getDisplayTime } from '@/lib/utils';


function DashBoard() {
  const { user, data, fetchUpdatedData, fetchNotifications, notifications, authRouter, authRouterForm } = useOutletContext();

  const [viewedClients, setViewedClients] = useState(data.clients);
  const [dashStatFilter, setDashStatFilter] = useState(null);
  const [showAlerts, setShowAlerts] = useState(false);

  const clients = data.clients;

  const dashboardStats = getAllDashboardStats(clients, data.referrals);

  const unfound = notifications?.unfoundClients?.[0];
  const found = notifications?.foundClients?.[0];

  const unfoundCount = unfound?.data?.length ?? 0;
  const foundCount = found?.data?.length ?? 0;

  const hasUnfound = unfoundCount > 0;
  const hasFound = foundCount > 0;

  const notificationsToggled = hasUnfound || hasFound;

  const notificationsCreatedAt =
    unfound?.createdAt || found?.createdAt;

  const displayTime = getDisplayTime(notificationsCreatedAt, "notificationAlert");

  useEffect(() => {
    if (!clients) return;

    let filtered = clients;

    switch (dashStatFilter) {
      case "URGENT":
        filtered = clients.filter(client =>
          client.referrals?.some(ref => ref.isPriority)
        );
        break;

      case "FOLLOW_UP":
        filtered = clients.filter(client =>
          client.referrals?.some(ref =>
            ref.followUpDate &&
            new Date(ref.followUpDate) < new Date()
          )
        );
        break;

      case "NEW":
        filtered = clients.filter(client => {
          const createdAt = new Date(client.createdAt);
          return (new Date() - createdAt) / (1000 * 60 * 60 * 24) <= 30;
        });
        break;

      default:
        filtered = clients;
    }

    setViewedClients(filtered);
  }, [dashStatFilter]);

  return (
    <>
      <Navbar className="bg-white shadow" authRouter={authRouter} authRouterForm={authRouterForm} user={user} />

      <main className="flex justify-center px-4 py-6">
        <div className="w-full max-w-7xl flex">

          <div className="flex-1 w-full h-screen grid grid-cols-1 auto-rows-min lg:grid-cols-4 gap-4 md:p-4">
            <DashStats
              className="col-span-1 row-span-3 lg:row-span-2 lg:col-span-4"
              data={dashboardStats}
              dashStatFilter={dashStatFilter}
              setDashStatFilter={setDashStatFilter}
              setViewedClients={setViewedClients}
            />

            {notificationsToggled && (
              <div className="{col-span-1 lg:col-span-4">
                <div
                  className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2"
                >
                  <div className="flex flex-col items-start text-gray-700 gap-2">
                  <span className="text-sm font-medium">
                    Updated{" "}
                    <span className="font-semibold">
                      {displayTime &&
                        ` ${displayTime}`}
                    </span>
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {foundCount > 0
                      ? `${foundCount} clients here passed 24 hours.`
                      : ""}
                  </span>
                  </div>
                  <div className="flex gap-2">
                    {hasUnfound && (
                      <button
                        className="text-xs bg-yellow-400 text-black hover:bg-yellow-500 px-3 py-1 rounded-md font-medium"
                        onClick={() => setShowAlerts(prev => !prev)}
                      >
                        {showAlerts ? "Hide" : "View"}
                      </button>
                    )}

                    {hasFound && (
                      <button
                        className="text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-md font-medium"
                        onClick={() => fetchNotifications?.()}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>

                {showAlerts && hasUnfound && (
                  <div className="mt-2 bg-yellow-50 relative border border-yellow-200 rounded-md p-4">
                    <NotificationsAlert
                      data={unfound}
                      fetchNotifications={fetchNotifications}

                      authRouter={authRouter}
                    />
                  </div>
                )}

              </div>
            )}

            <ClientToggleSection
              className="border-border-400 bg-background-alt border-2 rounded-md col-span-1 lg:col-span-3 row-span-10 max-h-[calc(100vh-250px)] overflow-y-auto"
              dashStatFilter={dashStatFilter}
              setDashStatFilter={setDashStatFilter}
              viewedClients={viewedClients}
              setViewedClients={setViewedClients}
              clientData={data.clients}
              authRouter={authRouter}
              authRouterForm={authRouterForm}
            />
            <div className="col-span-1 lg:col-span-1 row-span-10 max-h-[calc(100vh-250px)] min-h-0 overflow-hidden flex flex-col">
              <Notifications
                className="border-border-400 shadow-md border-2 rounded-md h-full min-h-0 flex flex-col"
                userNotes={user.notes}
                userReferrals={user.referrals}
                globalNotes={data.notes}
                fetchUpdatedData={fetchUpdatedData}
                authRouter={authRouter}
                authRouterForm={authRouterForm}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export default DashBoard;