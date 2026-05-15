
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-md pt-0">

        {viewedClients.map((client) => {
          const clientStats = getClientStats(client);
          return (
            <Button
              key={client.id}
              className={`bg-white text-color-foreground w-full h-auto p-0 justify-start rounded-xl`}
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
  };

  const currentStatusStyle =
    statusStyles[client.status] || "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <div className="flex-1 min-w-0 min-h-full bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-primary transition cursor-pointer">
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

function ClientToggleSection({className, clientData, userNotes, userReferrals, authRouter, authRouterForm, viewedClients, setViewedClients, dashStatFilter, setDashStatFilter}) {
  // for searching by name
  const [clientId, setClientId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [filter, setFilter] = useState("ENROLLED");
  const [calendarOpen, setCalendarOpen] = useState(false);

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
    <div className={`px-md py-xs md:py-md flex flex-col shadow-md ${className}`}>

      {/* Search + Filter Row */}
      <div className="w-full flex items-center gap-sm p-md pb-sm">

        {/* Search Input + Button */}
        <div className="flex flex-1 flex-col gap-sm">

          <div className="w-full">
            <ClientSearch currentClients={viewedClients} setViewedClients={setViewedClients} setClientId={setClientId} filter={filter} setFilter={setFilter} />
            </div>

      <div className="w-full flex items-center justify-between gap-sm">
        <div className="flex justify-start gap-2 md:justify-start">
          <Button className="flex items-center gap-1" onClick={() => {
            if (clientId) {
              setViewedClients(clientData.filter(client => client.id === clientId));
            } else {
              setViewedClients(clientData);
            }
          }}>
            <UserSearch className="color-black hover:color-white"/>
           <span>Search</span>
          </Button>

          <div className="relative">
            <ClientDropDownFilter filter={filter} setFilter={setFilter} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="color-black hover:color-white" />
                  <span>Add Client</span>
                </Button>
              </DialogTrigger>
              <ClientForm authRouter={authRouter} />
            </Dialog>
          </div>
            <Button onClick={() => setCalendarOpen(prev => !prev)}>
              <CalendarDays className="color-black hover:color-white" />
            </Button>
          </div>
        </div>
      </div>
      </div>

      {/* Calendar, enrolled toggle, layout toggle buttons*/}
      <div className="w-full flex items-center p-md gap-md">
        <div className="flex-1 justify-between gap-2 flex">
          <div className="text-sm ml-2 text-muted-foreground align-center flex items-center font-medium italic">
            {filter === "STAYED_OVERNIGHT" ? "Clients Who Stayed Overnight" : filter === "ENROLLED" || (dashStatFilter !== null) ? "Enrolled Clients" : filter === "WC" ? "Winter Contingency Clients" : filter === "INACTIVE" ? "Inactive Clients" : filter === "ALL" ? "All Clients" : ""}         {dashStatFilter && (
            <div className="text-sm ml-2 text-mufted-foreground align-center flex items-center font-medium italic">
              {dashStatFilter === "URGENT" ? "Clients with Urgent Referrals" : dashStatFilter === "FOLLOW_UP" ? "Clients with Upcoming Follow-ups" : dashStatFilter === "NEW" ? "New Clients (Last 30 Days)" : ""}
            </div>
          )}
          </div>
          <div className="text-sm text-left italic text-muted-foreground mb-1 ml-1">Today: <span className="font-medium">{new Date().toLocaleDateString()}</span></div>
        </div>
      </div>
      <div>
        <Combobox>
          <ComboboxContent>
            <ComboboxValue />
          </ComboboxContent>
        </Combobox>
      </div>
      <div className={`${calendarOpen ? 'flex' : 'hidden'} items-center justify-center gap-2 p-0  lg:px-md lg:pb-md`}>
      {calendarOpen && 
        <CalendarEmbedded
          date={date}
          setDate={setDate}
          referrals={userReferrals}
          notes={userNotes}
        />
      }
      </div>
      <ClientList className="flex-col" viewedClients={viewedClients}/>
    </div>  
  );
}



export default ClientToggleSection;