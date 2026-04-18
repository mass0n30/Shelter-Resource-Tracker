
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, CalendarDays, Funnel, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Combobox,ComboboxValue, ComboboxContent } from "@/components/ui/combobox";
import { useOutletContext } from "react-router-dom";

function ClientList({className, viewedClients, layout}) {
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
      <div className={`flex-1 gap-md justify-center rounded-md flex flex-wrap p-md pt-0 ${layout ? "flex-row" : "flex-col"}`}>
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

function ClientCard({client}) {

  return (
    <div className="flex-1 min-w-80 max-w-50 min-h-40 bg-gray-100 shadow-sm p-4 items-center border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-sm">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
        <p>{client?.avatar ? <img src={client.avatar} alt={`${client.firstName} ${client.lastName}`} /> : <span>{client.firstName.charAt(0)}{client.lastName.charAt(0)}</span>}</p>
      </div>
      <div className="flex flex-col">
        <h2 className="font-semibold text-lg">{client.firstName} {client.lastName}</h2>
        <div className="flex justify-start text-xs text-muted-foreground">
          <p>{client.bedLabel}</p>
        </div>
      </div>
    </div>

    <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-700">
      {client.status}
    </span>
  </div>


  <div className="mt-4 flex justify-between text-sm">
    <span>Resources</span>
    <span className="font-medium">2</span>
  </div>
    </div>
  );
};

import { ClientCombobox } from '../partials/ComboBox';

function ClientToggleSection({className, clientData}) {
  // for filtering during search and filter, separate from clientData to preserve original data for resetting filters
  const [viewedClients, setViewedClients] = useState(clientData);
  // for searching by name
  const [clientId, setClientId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [layout, setLayout] = useState(true); 
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className={`px-4 py-2 flex flex-col shadow-md ${className}`}>

      {/* Search + Filter Row */}
      <div className="w-full flex items-center gap-md p-md pb-sm">

        {/* Search Input + Button */}
        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">

          <div className="w-full md:flex-1">
            <ClientCombobox currentClients={viewedClients} setViewedClients={setViewedClients} setClientId={setClientId} />
          </div>

          <div className="flex justify-start gap-2 md:justify-start">
            <Button>
              Search
            </Button>

            <Button className="min-w-[160px] flex items-center gap-1 px-3 md: flex-1">
              <Funnel />
              Filter
              <ChevronDown />
            </Button>
          </div>

        </div>
      </div>

      {/* Calendar, enrolled toggle, layout toggle buttons*/}
      <div className="w-full flex items-center pl-md pr-md pb-lg gap-md">
        <div className="flex-1 justify-start gap-2 flex">
          <Button>
            <CalendarDays color="#000000" />
          </Button>
          <Button>
            Enrolled Clients
          </Button>
        </div>
        {/* toggle rows displays more info on each client ? */}
        <div className="flex-1 justify-end gap-2 flex ">
          <Button onClick={() => setLayout(true)}>
            <LayoutGrid color="#000000" />
          </Button>
          <Button onClick={() => setLayout(false)}>
            <List color="#000000" />
          </Button>
        </div>
      </div>
      <div>
        <Combobox>
          <ComboboxContent>
            <ComboboxValue />
          </ComboboxContent>
        </Combobox>
      </div>
      <ClientList className="flex-col" viewedClients={viewedClients} layout={layout} />
    </div>  
  );
}

export default ClientToggleSection;