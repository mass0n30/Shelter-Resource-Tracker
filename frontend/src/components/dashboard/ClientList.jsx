
import { Button } from '../partials/Button';
import { ClockAlert, Plus, CalendarDays, UserSearch, ChevronDown, BedDouble } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Combobox,ComboboxValue, ComboboxContent } from "@/components/ui/combobox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ClientForm from '../forms/ClientForm';
import { useOutletContext } from "react-router-dom";
import { getClientStats } from '@/lib/utils';

function ClientList({className, viewedClients}) {
    const { user, data, SetNewFetch, authRouter, authRouterForm } = useOutletContext();

    const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (!viewedClients || viewedClients.length === 0) {  
    return (
      <div className={`clientList ${className} flex items-center justify-center`}>
        <p className="text-muted-foreground">No clients found.</p>
      </div>
    );
  }


  return (
    <div className={`clientList ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2">

        {viewedClients.map((client) => {
          const clientStats = getClientStats(client);
          return (
            <Button
              key={client.id}
              className={`bg-white rounded-none text-color-foreground w-full h-auto p-0 justify-start`}
              onClick={() => {
              navigate(`/dashboard/clients/${client.id}`);
            }}
          >
            <ClientCard client={client} clientStats={clientStats} />
          </Button>
        );
      })}
      </div>
    </div>
  );
}

function ClientCard({ client, clientStats }) {
  const statusStyles = {
    ENROLLED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INACTIVE: "bg-slate-100 text-slate-600 border-slate-200",
    WC: "bg-blue-50 text-blue-700 border-blue-200",
    STAYED_OVERNIGHT: "bg-indigo-50 text-indigo-700 border-indigo-200",
    HOUSED: "bg-green-50 text-green-700 border-green-200",
  };

  const currentStatusStyle =
    statusStyles[client.status] || "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <div className="flex-1 min-w-0 min-h-full bg-white border border-primaryLight p-xs sm:px-lg py-md shadow-sm hover:shadow-md hover:border-primary transition cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-600 overflow-hidden">
            {client?.avatar ? (
              <img
                className="w-full h-full object-cover"
                src={client.avatar}
                alt={`${client.firstName} ${client.lastName}`}
              />
            ) : (
              <span>
                {client.firstName.charAt(0)}
                {client.lastName.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h2 className="text-foreground font-semibold text-sm sm:text-base md:text-lg truncate">
              {client.firstName} {client.lastName}
            </h2>


          </div>
        </div>

        <span
          className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] sm:text-xs font-medium ${currentStatusStyle}`}
        >
          {client?.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        {clientStats?.totalReferrals >= 0 && (
          <div className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] sm:text-xs text-gray-700">
            <span>Resources</span>
            <span className="font-semibold">{clientStats.totalReferrals}</span>
          </div>
        )}

        {clientStats?.urgentReferrals > 0 && (
          <div className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] sm:text-xs text-red-700">
            <ClockAlert className="h-3.5 w-3.5" />
            <span>Urgent</span>
            <span className="font-semibold">{clientStats.urgentReferrals}</span>
          </div>
        )}

        {clientStats?.upcomingFollowUps > 0 && (
          <div className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] sm:text-xs text-blue-700">
            <span>Upcoming</span>
            <span className="font-semibold">
              {clientStats.upcomingFollowUps}
            </span>
          </div>
        )}

        {clientStats?.expiredFollowUps > 0 && (
          <div className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] sm:text-xs text-amber-700">
            <span>Expired</span>
            <span className="font-semibold">
              {clientStats.expiredFollowUps}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

import { ClientSearch } from '../partials/Search';
import { ClientDropDownFilter } from '../partials/Dropdown';
import { useEffect } from 'react';
import { CalendarEmbedded } from './CalenderView';
import { getAllDashboardStats } from '@/lib/utils';
import DashStats from './DashStats';
import { all } from 'axios';

function ClientToggleSection({className, data, allReferrals, allClientData, userNotes, userReferrals, authRouter, authRouterForm, viewedClients, setViewedClients, dashStatFilter, setDashStatFilter, openForm, setOpenForm}) {
  // for searching by name
  const [clientId, setClientId] = useState(null);
  const [date, setDate] = useState(null);
  const [filter, setFilter] = useState("ENROLLED");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dashboardStats = getAllDashboardStats(allClientData, allReferrals);

  useEffect(() => {
    if (dashStatFilter) {
      setDashStatFilter(null);
    }

    const fetchClients = async () => {
    try {
      const response = await authRouter.get("/dashboard/clients", {
        params: {
          filter: filter,
        },
      });
      setViewedClients(response.data.clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  fetchClients();
  }, [filter]);

return (
  <div className={`flex flex-col overflow-hidden ${className}`}>
    <div className="flex flex-col border border-border p-sm md:p-lg">
      <div className="flex items-center justify-between gap-2">
        {/* Section date/title */}
        <div className="flex flex-col gap-sm">
          <p className="text-xs sm:text-sm font-semibold text-foreground">
            Today  {new Date().toLocaleDateString()}
          </p>

          <p className="text-xs text-muted-foreground m-sm">
            {filter === "STAYED_OVERNIGHT"
              ? "Clients Who Stayed Overnight"
              : filter === "ENROLLED" || dashStatFilter !== null
              ? "Enrolled Clients"
              : filter === "WC"
              ? "Winter Contingency Clients"
              : filter === "INACTIVE"
              ? "Inactive Clients"
              : filter === "ALL"
              ? "All Clients"
              : filter === "HOUSED"
              ? "Housed Clients"
              : ""}
            {dashStatFilter === "URGENT" && " with Urgent Referrals"}
            {dashStatFilter === "FOLLOW_UP" && " with Upcoming Follow-ups"}
            {dashStatFilter === "NEW" && " New Clients"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Dialog
            open={openForm === "client"}
            onOpenChange={(isOpen) => setOpenForm(isOpen ? "client" : null)}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1 rounded-lg">
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Add Client</span>
              </Button>
            </DialogTrigger>

            <ClientForm authRouter={authRouter} />
          </Dialog>

          <Button
            size="sm"
            variant="outline"
            className="rounded-lg"
            onClick={() => setCalendarOpen((prev) => !prev)}
          >
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Search */}
      <ClientSearch
        currentClients={viewedClients}
        setViewedClients={setViewedClients}
        setClientId={setClientId}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 mt-sm">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            size="sm"
            className="flex items-center gap-1 rounded-lg"
            onClick={() => {
              if (clientId) {
                setViewedClients(allClientData.filter((client) => client.id === clientId));
              } else {
                setViewedClients(allClientData);
              }
            }}
          >
            <UserSearch className="h-4 w-4" />
            <span>Search</span>
          </Button>

          <ClientDropDownFilter filter={filter} setFilter={setFilter} />
        </div>
      </div>
    </div>

    {calendarOpen && (
      <div className="border-b border-border px-3 py-3 sm:px-4 md:px-5">
        <CalendarEmbedded
          date={date}
          setDate={setDate}
          referrals={userReferrals}
          notes={userNotes}
        />
      </div>
    )}
        <DashStats
          className="w-full border-t border-border "
          data={dashboardStats}
          dashStatFilter={dashStatFilter}
          setDashStatFilter={setDashStatFilter}
          setViewedClients={setViewedClients}
        />

    <ClientList
      className="border-t border-border max-h-none ml-1 overflow-visible lg:max-h-screen lg:overflow-y-auto"
      viewedClients={viewedClients}
    />
  </div>
);
}



export default ClientToggleSection;