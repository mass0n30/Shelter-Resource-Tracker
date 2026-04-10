
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function ClientList() {

  return (
    <div className={'clientList'}>
      <ClientToggleSection />
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

function ClientToggleSection() {
  return (
    <div className="w-full flex flex-col gap-4 sticky top-0 bg-white z-10 p-4 shadow-sm">

      {/* Top Row */}
      <div className="w-full">
        <ClientCombobox />
      </div>

      {/* Search + Filter Row */}
      <div className="w-full flex items-center gap-2">

        {/* Search Input + Button */}
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search Clients"
            className="flex-1"
          />
          <Button>
            Search
          </Button>
        </div>

        {/* Filter Button */}
        <Button variant="outline">
          Filter
        </Button>

      </div>
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