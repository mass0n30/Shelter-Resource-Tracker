
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
  return (
    <div className="flex-1 min-w-0 min-h-full bg-white border rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition cursor-pointer">
      
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Avatar */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-600">
            {client?.avatar ? (
              <img
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

          {/* Name + Bed */}
          <div className="flex flex-col">
            <h2 className="text-foreground font-semibold text-sm sm:text-base md:text-lg">
              {client.firstName} {client.lastName}
            </h2>

            <div className="text-[10px] align-start flex sm:text-xs text-foreground">
              {client.bedLabel}
            </div>
          </div>

        </div>

        {/* Status Badge */}
        <span
          className={`text-[10px] sm:text-xs md:text-sm px-2 py-1 rounded ${
            client.status === "ENROLLED"
              ? "bg-green-100 text-green-700"
              : client.status === "INACTIVE"
              ? "bg-red-100 text-red-700"
              : client.status === "WC"
              ? "bg-blue-100 text-blue-700"
              : client.status === "STAYED_OVERNIGHT"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {client?.status}
        </span>
      </div>
      {/* Bottom Row */}
      <div className="mt-3 sm:mt-4 flex justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-sm">
            {clientStats?.totalReferrals >= 0 && <div className='p-xs gap-xs text-[12px] sm:text-xs text-foreground rounded-md bg-backgroundAlt'><span className='mr-1'>Resources</span><span>{clientStats.totalReferrals}</span></div>}
            {clientStats?.urgentReferrals > 0 && <div className='flex gap-xs p-xs text-[10px] sm:text-xs text-white rounded-md bg-red-500'><ClockAlert className='h-4 w-4' /><span className='mr-1'>Urgent</span><span>{clientStats.urgentReferrals}</span></div>}
            {clientStats?.upcomingFollowUps > 0 && <div className='p-xs gap-xs text-[12px] sm:text-xs text-white rounded-md bg-blue-500'><span className='mr-1'>Upcoming</span><span>{clientStats.upcomingFollowUps}</span></div>}
            {clientStats?.expiredFollowUps > 0 && <div className='p-xs gap-xs text-[12px] sm:text-xs text-white rounded-md bg-orange-500'><span className='mr-1'>Expired</span><span>{clientStats.expiredFollowUps}</span></div>}
          </div>
        </div>
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
            <UserSearch color="background" />
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
                  <Plus color="background" />
                  <span>Add Client</span>
                </Button>
              </DialogTrigger>
              <ClientForm authRouter={authRouter} />
            </Dialog>
          </div>
            <Button onClick={() => setCalendarOpen(prev => !prev)}>
              <CalendarDays color="background" />
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