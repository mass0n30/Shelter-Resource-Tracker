
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, CalendarDays, Funnel, ChevronDown } from 'lucide-react';
import { useState } from 'react';

function ClientList({clientData,className}) {

  if (!clientData) {  
    return (
      <div className={`clientList ${className} flex items-center justify-center`}>
        <p className="text-muted-foreground">No clients found.</p>
      </div>
    );
  }


  return (
    <div className={`clientList ${className}`}>
      <div className="flex-1 gap-md justify-center rounded-md flex flex-wrap p-md pt-0"> 
        {clientData.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}

import { ClientCombobox } from '../partials/ComboBox';

function ClientToggleSection({className, clientData}) {
  return (
    <div className={`px-4 py-2 flex flex-col shadow-md ${className}`}>

      {/* Search + Filter Row */}
      <div className="w-full flex items-center gap-md p-md pb-sm">

        {/* Search Input + Button */}
        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">

          <div className="w-full md:flex-1">
            <ClientCombobox />
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
          <Button>
            <LayoutGrid color="#000000" />
          </Button>
          <Button>
            <List color="#000000" />
          </Button>
        </div>
      </div>
      <ClientList className="flex-1 flex" clientData={clientData} />
    </div>  
  );
}

function ClientCard({client}) {

  return (
    <div className="flex-1 min-w-80 max-w-50% min-h-40 bg-gray-100 shadow-sm p-4 items-center border rounded-xl p-4 shadow-sm hover:shadow-md transition">
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
}

export default ClientToggleSection;