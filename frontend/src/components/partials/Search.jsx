import {useState, useEffect} from "react";

export function ClientSearch({ currentClients, setViewedClients, setClientId, filter, setFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [storedClients, setStoredClients] = useState(currentClients);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilter("ENROLLED");
      setClientId(null);
      return;
    }

    const filtered = currentClients.filter((client) =>
      (client.firstName + " " + client.lastName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setViewedClients(filtered);
  }, [searchTerm]);

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search clients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}