
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function ClientList({className}) {

  return (
    <div className={`clientList ${className}`}>
      <div className="min-h-32 bg-gray-200 rounded-md mx-4"> 
        <ClientCard/>
        <ClientCard/>
        <ClientCard/>
        <ClientCard/>
        <ClientCard/>
        <ClientCard/>
      </div>
    </div>
  );
}

import { ClientCombobox } from '../partials/ComboBox';

function ClientToggleSection({className}) {
  return (
    <div className={`border-border-400 border-2 px-4 py-2 flex flex-col gap-4 ${className}`}>

      {/* Search + Filter Row */}
      <div className="w-full flex items-center gap-2">

        {/* Search Input + Button */}
        <div className="flex flex-1 items-center gap-2">
        <ClientCombobox />
          <Button>
            Search
          </Button>
          <Button >
            Filter
          </Button>
        </div>

      </div>
      <ClientList className="flex-1" />
    </div>
  );
}

function ClientCard() {
  return (
    <div className="w-full min-h-32 bg-gray-100 rounded-lg shadow-sm p-4 flex items-center">
      <h3 className="text-lg font-semibold">Client Card</h3>
    </div>
  );
}

export default ClientToggleSection;