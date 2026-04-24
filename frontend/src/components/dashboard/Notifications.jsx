import { Bell, Notebook } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@base-ui/react";
import { set } from "zod";
// order Notes and timed Resources in this section? Day of or soon timed in Banners ?
function Notifications({className, data, SetSuccess, SetLoading, SetNewFetch }) {
  const [toggle, setToggle] = useState("reminders");

  // add a toggle expansion on desktop and mobile ?
  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className={className}>
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold mb-2">{toggle === "reminders" ? "Reminders" : "Notes"}</h3>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex flex-1 items-center justify-center gap-2 mb-4">
            <Button onClick={() => setToggle("reminders")} variant="outline" className={`flex flex-1 border-2 border-border py-2 px-2 h-auto p-0 rounded-md text-foreground bg-transparent hover:bg-transparent ${toggle === "reminders" ? "border-2 border-primary" : ""}`}>
              <Bell className={`mr-1 w-4 h-4 lg:w-5 lg:h-5 ${toggle === "reminders" ? "fill-yellow-400" : "text-muted opacity-60"}`} />
              <h2 className={`text-sm ${toggle === "reminders" ? "" : "text-muted opacity-80"}`}>Reminders</h2>
            </Button>
          </div>
          <div className={"flex flex-1 items-center justify-center gap-2 mb-4"}>
            <Button onClick={() => setToggle("notes")} variant="outline" className={`flex flex-1 border-2 border-border py-2 px-2 h-auto p-0 rounded-md text-foreground bg-transparent hover:bg-transparent ${toggle === "notes" ? "border-2 border-primary " : ""}`}>
              <Notebook className={`mr-1 w-4 h-4 lg:w-5 lg:h-5 ${toggle === "notes" ? "fill-primary" : "text-muted opacity-60"}`} />
              <h2 className={`text-sm ${toggle === "notes" ? "" : "text-muted opacity-80"}`}>Notes</h2>
            </Button>
          </div>
        </div>

        <ul className="mt-2">
          {data?.length === 0 || data !== undefined ? (
            <li className="text-gray-500"><i>No {toggle === "reminders" ? "reminders" : "notes"} notifications</i></li>
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