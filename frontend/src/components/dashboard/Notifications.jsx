import { Bell, Notebook } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@base-ui/react";
// order Notes and timed Resources in this section? Day of or soon timed in Banners ?
function Notifications({className, data, SetSuccess, SetLoading, SetNewFetch }) {
  const [toggle, setToggle] = useState(true);

  // add a toggle expansion on desktop and mobile ?
  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className={className}>
      <div className="flex-1 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex flex-1 items-center justify-center gap-2 mb-4">
            <Button variant="outline" className="flex h-auto p-0 rounded-md text-foreground bg-transparent hover:bg-transparent">
              <Bell className="mr-1 w-4 h-4 lg:w-5 lg:h-5" />
              <h2 className="text-sm">Reminders</h2>
            </Button>
          </div>
          <div className="flex flex-1 items-center justify-center gap-2 mb-4 mr-2">
            <Button variant="outline" className="flex h-auto p-0 rounded-md text-foreground bg-transparent hover:bg-transparent">
              <Notebook className="mr-1 w-4 h-4 lg:w-5 lg:h-5" />
              <h2 className="text-sm">Notes</h2>
            </Button>
          </div>
        </div>

        <ul className="mt-2">
          {data?.length === 0 || data !== undefined ? (
            <li className="text-gray-500"><i>No notifications</i></li>
          ) : (
            data.map((notification) => (
              <li key={notification.id} className="border-b border-gray-200 py-2">
                {notification.message}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );

};

export default Notifications;