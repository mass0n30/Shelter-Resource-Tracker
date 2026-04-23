
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, CalendarDays, Funnel, ChevronDown, BedDouble } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Combobox,ComboboxValue, ComboboxContent } from "@/components/ui/combobox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ClientForm from '../forms/ClientForm';
import { useOutletContext } from "react-router-dom";

function ClientList({className, viewedClients}) {
    const { user, data, success, SetSuccess, SetLoading, loading, SetNewFetch, authRouter, authRouterForm } = useOutletContext();

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
      <div className={`flex-1 gap-md justify-center rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 p-md pt-0`}>
        {viewedClients.map(client => (
          <Button
            key={client.id}
            variant="ghost"
            className="w-full h-auto p-0 justify-start rounded-xl bg-transparent hover:bg-transparent"
            onClick={() => {
              SetLoading(true);
              navigate(`/dashboard/clients/${client.id}`);
            }}
          >
            <ClientCard client={client} />
          </Button>
        ))}
      </div>
    </div>
  );
};

function ClientCard({ client }) {
  return (
    <div className="flex-1 min-w-0 bg-background border rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition cursor-pointer">
      
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
            <h2 className="font-semibold text-sm sm:text-base md:text-lg">
              {client.firstName} {client.lastName}
            </h2>

            <div className="text-[10px] align-start flex sm:text-xs text-muted-foreground">
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
          {client.status}
        </span>
      </div>
      {/* Bottom Row */}
      <div className="mt-3 sm:mt-4 flex justify-between text-xs sm:text-sm">
        <span>Resources</span>
        <span className="font-medium">2</span>
      </div>

    </div>
  );
}

import { ClientSearch } from '../partials/Search';
import { useEffect } from 'react';

function ClientToggleSection({className, clientData, authRouter, authRouterForm}) {
  // for filtering during search and filter, separate from clientData to preserve original data for resetting filters
  const [viewedClients, setViewedClients] = useState(clientData);
  // for searching by name
  const [clientId, setClientId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("ENROLLED");
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
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
    <div className={`px-4 py-2 flex flex-col shadow-md ${className}`}>

      {/* Search + Filter Row */}
      <div className="w-full flex items-center gap-md p-md pb-sm">

        {/* Search Input + Button */}
        <div className="flex flex-1 flex-col gap-2">

          <div className="w-full">
            <ClientSearch currentClients={viewedClients} setViewedClients={setViewedClients} setClientId={setClientId} filter={filter} setFilter={setFilter} />
          </div>

          <div className="flex justify-start gap-2 md:justify-start">
            <Button variant="outline" onClick={() => {
              if (clientId) {
                setViewedClients(clientData.filter(client => client.id === clientId));
              } else {
                setViewedClients(clientData);
              }
            }}>
              Search
            </Button>

            <div className="relative">
              <Button
                onClick={() => setFilterOpen(prev => !prev)}
                className="min-w-[160px] flex items-center gap-1 px-3"
                variant={filterOpen ? "outline" : "outline"}
              >
                <Funnel />
                Filter
                <ChevronDown />
              </Button>

              {filterOpen && (
                <div className="absolute top-full left-0 mt-2 w-[160px] bg-white border rounded-md shadow-lg z-50">
                  <div className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${filter === "ENROLLED" ? "bg-gray-100" : ""}`} onClick={() => {
                    setFilter("ENROLLED");
                    setFilterOpen(false);
                  }}>
                    Enrolled
                  </div>
                  <div className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${filter === "STAYED_OVERNIGHT" ? "bg-gray-100" : ""}`} onClick={() => {
                    setFilter("STAYED_OVERNIGHT");
                    setFilterOpen(false);
                  }}>
                    Stayed Overnight
                  </div>
                  <div className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${filter === "WC" ? "bg-gray-100" : ""}`} onClick={() => {
                    setFilter("WC");
                    setFilterOpen(false); 
                  }}>
                    W.C.
                  </div>
                  <div className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${filter === "INACTIVE" ? "bg-gray-100" : ""}`} onClick={() => {
                    setFilter("INACTIVE");
                    setFilterOpen(false);
                  }}>
                    Inactive
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Calendar, enrolled toggle, layout toggle buttons*/}
      <div className="w-full flex items-center pl-md pr-md pb-lg gap-md">
        <div className="flex-1 justify-between gap-2 flex">
          <div className="text-sm ml-2 text-muted-foreground align-center flex items-center font-medium italic">
            {filter === "STAYED_OVERNIGHT" ? "Clients Who Stayed Overnight" : filter === "ENROLLED" ? "Enrolled Clients" : filter === "WC" ? "Winter Contingency Clients" : filter === "INACTIVE" ? "Inactive Clients" : ""}
          </div>
        <div className="flex items-center gap-2">
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Create Client</Button>
              </DialogTrigger>
              <ClientForm authRouter={authRouter} authRouterForm={authRouterForm} />
            </Dialog>
          </div>
            <Button variant="outline">
              <CalendarDays color="#000000" />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Combobox>
          <ComboboxContent>
            <ComboboxValue />
          </ComboboxContent>
        </Combobox>
      </div>
      <ClientList className="flex-col" viewedClients={viewedClients}/>
    </div>  
  );
}



export default ClientToggleSection;