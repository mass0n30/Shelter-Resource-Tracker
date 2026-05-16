
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import DashStats from '../components/dashboard/DashStats';
import ClientToggleSection from '../components/dashboard/ClientList';
import Notifications from '../components/dashboard/Notifications';
import NotificationsAlert from '../components/dashboard/NotificationsAlert';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { getAllDashboardStats, getDisplayTime } from '@/lib/utils';


function DashBoard() {
  const { user, data, fetchUpdatedData, fetchNotifications, notifications, authRouter, authRouterForm } = useOutletContext();

  const [viewedClients, setViewedClients] = useState(data.clients);
  const [dashStatFilter, setDashStatFilter] = useState(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [toggle, setToggle] = useState("reminders");
  const [openForm, setOpenForm] = useState(null);

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
            new Date(ref.followUpDate) >= new Date() 
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

  const handleMarkRead = async () => {
    try {
      await authRouter.post('/dashboard/notifications/mark-read');
    } catch (err) {
      console.error(err);
    } finally {
      setShowAlerts(false);
      fetchNotifications();
    }
  };

  if (user?.mustChangePassword && location.pathname !== "/change-password") {
  return <Navigate to="/change-password" replace />;
}

  return (
    <>
      <Navbar className="bg-white shadow h-24em" authRouter={authRouter} authRouterForm={authRouterForm} user={user} />

      <main className="bg-primaryLight flex px-sm md:px-md">
        <div className="flex-1 w-full max-w-7xl flex">

          <div className="flex-1 w-full h-full grid grid-cols-1 auto-rows-min lg:grid-cols-4 gap-sm md:gap-md p-sm md:p-md">
            <DashStats
              className="col-span-1 row-span-3 lg:row-span-2 lg:col-span-4"
              data={dashboardStats}
              dashStatFilter={dashStatFilter}
              setDashStatFilter={setDashStatFilter}
              setViewedClients={setViewedClients}
            />

            {notificationsToggled && (
              <div className="col-span-1 lg:col-span-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-backgroundAlt border border-border rounded-md px-4 py-3 shadow-sm">
                  <div className="flex flex-col items-start gap-1 text-foreground">
                    <span className="text-sm font-semibold">
                      Nightly update summary
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Updated{" "}
                      <span className="font-medium text-foreground">
                        {displayTime || "recently"}
                      </span>
                    </span>

                    {foundCount > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {foundCount} clients stayed overnight in the past 24 hours.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {hasUnfound && (
                      <button
                        className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 px-3 py-1.5 rounded-lg font-medium transition"
                        onClick={() => setShowAlerts((prev) => !prev)}
                      >
                        {showAlerts ? "Hide Alerts" : "View Alerts"}
                      </button>
                    )}

                    <Button
                      onClick={handleMarkRead}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white/80 hover:bg-primaryLight/60 border-primary/20 text-foreground rounded-lg"
                    >
                      Mark Read
                    </Button>
                  </div>
                </div>

                {showAlerts && hasUnfound && (
                  <div className="mt-3 bg-background border border-primary/15 rounded-xl shadow-sm overflow-hidden">
                    <NotificationsAlert
                      data={unfound}
                      fetchNotifications={fetchNotifications}
                      authRouter={authRouter}
                      openForm={openForm}
                      setOpenForm={setOpenForm}
                    />
                  </div>
                )}
              </div>
            )}

            <ClientToggleSection
              className="border-border-400 bg-background border-2 rounded-md col-span-1 lg:col-span-3 row-span-10 min-h-[calc(120vh-250px)]  max-h-[calc(120vh-250px)] relative overflow-y-auto"
              dashStatFilter={dashStatFilter}
              setDashStatFilter={setDashStatFilter}
              viewedClients={viewedClients}
              setViewedClients={setViewedClients}
              clientData={data.clients}
              userNotes={user.notes}
              userReferrals={user.referrals}
              authRouter={authRouter}
              authRouterForm={authRouterForm}
              openForm={openForm}
              setOpenForm={setOpenForm}
            />
            <div className="col-span-1 lg:col-span-1 row-span-10 min-h-0 min-h-[calc(120vh-250px)] overflow-hidden flex flex-col">
              <Notifications
                className="border-border-400 shadow-md border-2 rounded-md min-h-0 flex flex-col"
                userNotes={user.notes}
                currentUser={user}
                userReferrals={user.referrals}
                globalNotes={data.notes}
                fetchUpdatedData={fetchUpdatedData}
                authRouter={authRouter}
                authRouterForm={authRouterForm}
                toggle={toggle}
                setToggle={setToggle}
                openForm={openForm}
                setOpenForm={setOpenForm}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export default DashBoard;