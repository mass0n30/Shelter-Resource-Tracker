
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import ClientToggleSection from '../components/dashboard/ClientList';
import Notifications from '../components/dashboard/Notifications';
import RecentPostedNotes from '../components/dashboard/RecentNotes';
import NotificationsAlert from '../components/dashboard/NotificationsAlert';
import Navbar from '../components/Navbar';
import DashboardHero from '../components/dashboard/DashboardHero'
import { Button } from '@/components/ui/button';
import {  getDisplayTime } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CircleAlert, NotebookText, X } from "lucide-react";
import { useAsyncStatus } from '../components/partials/Loading';

function DashBoard() {
  const { user, data, fetchUpdatedData, fetchNotifications, notifications, dashStats, authRouter, authRouterForm, openForm, setOpenForm } = useOutletContext();
  const { success, setSuccess, loading, setLoading, setLoadingDuration, error, setError } = useAsyncStatus({loadingDuration: 2000, successDuration: 3000});

  const [viewedClients, setViewedClients] = useState(data.clients);
  const [dashStatFilter, setDashStatFilter] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [recentNotesOpen, setRecentNotesOpen] = useState(false);
  const [toggle, setToggle] = useState("reminders");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const clients = data.clients;

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
    if (dashStatFilter) {
      handleGetClientsByFilter();
    } else {
      setViewedClients(clients);
    }
  }, [dashStatFilter, clients]);

  const handleGetClientsByFilter = async () => {
      if (!clients) return;
      setViewedClients(null); 
      setLoading(true);
      try {
        authRouter.get('/dashboard/dashStatFilters', {
          params: { filter: dashStatFilter }
        }).then(res => {
          setViewedClients(res.data);
        });
      } catch (err) {
        console.error("Error filtering clients:", err);
      } 
    };

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
    <Navbar
      className="sticky top-0 z-50 bg-white shadow-sm min-h-navHeight"
      authRouter={authRouter}
      authRouterForm={authRouterForm}
      user={user}
      fetchUpdatedData={fetchUpdatedData}
      openForm={openForm}
      setOpenForm={setOpenForm}
      notificationsOpen={notificationsOpen}
      setNotificationsOpen={setNotificationsOpen}
    />

    <main className="min-h-screen bg-primaryLight">
      <div className="mx-auto flex w-full flex-col">
        <DashboardHero dashStats={dashStats} dashStatFilter={dashStatFilter} setDashStatFilter={setDashStatFilter} handleGetClientsByFilter={handleGetClientsByFilter} />
        {notificationsToggled && (
          <section className="border border-border bg-backgroundAlt shadow-sm overflow-hidden">
            <div className="flex flex-col gap-3 py-md px-lg sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col items-start gap-1 text-foreground relative">
                <span className="text-sm font-semibold">
                  <CircleAlert className="inline mr-1 mb-2 text-red-500" size={18} />
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
                    className="rounded-lg border border-amber-200 bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-200"
                    onClick={() => setShowAlerts((prev) => !prev)}
                  >
                    {showAlerts ? "Hide Alerts" : "View Alerts"}
                  </button>
                )}

                <Button
                  onClick={handleMarkRead}
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-primary/20 bg-white/80 text-xs text-foreground hover:bg-primary hover:text-white hover:border-primary/40"
                >
                  Mark Read
                </Button>
              </div>
            </div>

            {showAlerts && hasUnfound && (
              <div className="border-t border-border bg-backgroundAlt">
                <NotificationsAlert
                  unfound={unfound}
                  found={found}
                  fetchNotifications={fetchNotifications}
                  authRouter={authRouter}
                  openForm={openForm}
                  setOpenForm={setOpenForm}
                />
              </div>
            )}
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-5">

          <ClientToggleSection
            className="min-w-0 lg:col-span-4 border border-border bg-background shadow-sm overflow-hidden"
            dashStatFilter={dashStatFilter}
            setDashStatFilter={setDashStatFilter}
            viewedClients={viewedClients}
            setViewedClients={setViewedClients}
            allClientData={data.clients}
            allReferrals={data.referrals}
            userNotes={user.notes}
            userReferrals={user.referrals}
            authRouter={authRouter}
            authRouterForm={authRouterForm}
            openForm={openForm}
            setOpenForm={setOpenForm}
            loading={loading}
            setLoading={setLoading}
          />

          <aside className="hidden min-w-0 lg:block h-[calc(130vh)] h-full">
            <div className="flex h-full min-h-[calc(130vh)] overflow-hidden">
              <Notifications
                className="flex flex-1 h-full flex-col border border-border bg-background shadow-sm"
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
          </aside>
        </section>
          <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-md">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setRecentNotesOpen((prev) => !prev)}
                className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-border bg-primary text-white opacity-80 shadow-md transition hover:opacity-100 hover:shadow-lg"
                aria-label={recentNotesOpen ? "Close recent notes" : "Open recent notes"}
              >
                {recentNotesOpen ? (
                  <X className="h-9 w-9 text-white" />
                ) : (
                  <NotebookText className="h-10 w-10 text-white" />
                )}
              </button>
            </div>

            {recentNotesOpen && (
              <div className="overflow-hidden rounded-lg border border-border bg-backgroundAlt shadow-lg">
                <RecentPostedNotes notes={data.notes} />
              </div>
            )}
          </div>
      </div>
    </main>

    <Sheet open={notificationsOpen} className="transition-all duration-300 ease-in-out" onOpenChange={setNotificationsOpen}>
      <SheetContent side="right" className="w-full transition-all duration-300 ease-in-out bg-white p-0 lg:hidden">
        <SheetHeader className="border-b border-border p-0 text-left">
          <SheetTitle></SheetTitle>
        </SheetHeader>

        <div className="h-[calc(100vh)] overflow-y-auto p-3 pt-0">
          <Notifications
            className="min-h-0 border-0 shadow-none"
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
      </SheetContent>
    </Sheet>
  </>
);
}
export default DashBoard;