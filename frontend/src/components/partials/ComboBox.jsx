import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const clients = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown"]

export function ClientCombobox() {
  return (
    <div className="w-full max-w-sm">
      <Combobox items={clients}>
        
        <ComboboxInput
          placeholder="Select a client"
          className="w-full px-3 py-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <ComboboxContent className="mt-1 border rounded-md bg-white shadow-md">

          <ComboboxEmpty className="p-2 text-sm text-gray-500">
            No items found.
          </ComboboxEmpty>

          <ComboboxList className="max-h-60 overflow-y-auto">

            {(item) => (
              <ComboboxItem
                key={item}
                value={item}
                className="px-3 py-2 cursor-pointer hover:bg-blue-100 rounded-sm text-black"
              >
                {item}
              </ComboboxItem>
            )}

          </ComboboxList>
        </ComboboxContent>

      </Combobox>
    </div>
  );
}