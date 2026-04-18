import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox"

import { useState, useEffect } from "react"

// value prop in <ComboboxItem> is mandatory for internal state management of the combobox, but we also want to set the search term to the selected client's name, syncing state with internal state of the combobox, so we pass the search term as value and update it on selection
export function ClientCombobox({ currentClients, setViewedClients, setClientId }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSetClient = (id, name) => {
    setClientId(id);
    setSearchTerm(name);
  };

  const filteredClients = currentClients.filter((client) =>
    (client.firstName + " " + client.lastName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!searchTerm.trim()) {
      setViewedClients(currentClients);
      setClientId(null);
    }
  }, [searchTerm, currentClients]);

  return (
    <div className="w-full h-full">
      <Combobox items={currentClients} className="w-full h-full"
        onValueChange={(value) => {
          const selectedClient = currentClients.find(
            (client) => client.firstName + " " + client.lastName === value
          );
          if (selectedClient) {
            handleSetClient(selectedClient.id, value);
          }
        }}
      >
        <ComboboxInput
          placeholder="Select a client"
          onChange={(e) => {
            const val = e.target.value;
            setSearchTerm(val);

            const filtered = currentClients.filter((client) =>
              (client.firstName + " " + client.lastName)
                .toLowerCase()
                .includes(val.toLowerCase())
            );
            // updating viewed clients upon every keystroke 
            setViewedClients(filtered);
          }}
          className="w-full px-3 py-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <ComboboxContent className="mt-1 border rounded-md bg-white shadow-md">
          <ComboboxEmpty className="p-2 text-sm text-gray-500">
            No items found.
          </ComboboxEmpty>

          <ComboboxList className="max-h-60 overflow-y-auto">
            {((item) => (
              <ComboboxItem
                key={item.id}
                value={item.firstName + " " + item.lastName}
                className="px-3 py-2 cursor-pointer hover:bg-blue-100 rounded-sm text-black"
              >
                {item.firstName} {item.lastName}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}