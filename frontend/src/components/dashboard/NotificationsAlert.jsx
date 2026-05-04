import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ClientForm from "../forms/ClientForm";
import { getDisplayTime } from "@/lib/utils";

function NotificationsAlert({ data, SetLoading, authRouter, className }) {

  const displayTime = getDisplayTime(data?.createdAt, "notificationAlert");

  const handleMarkRead = async () => {
    try {
      await authRouter.post('/dashboard/notifications/mark-read');
    } catch (err) {
      console.error(err);
    }
  };
  if (!data) return null;

  return (
    <div className={`flex flex-col p-4 gap-3 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Unmatched Clients
        </h3>
        <Button
          onClick={handleMarkRead}
          variant="outline"
          size="sm"
        >
          Mark Read
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {data?.message}
      </p>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-40">
        {data?.data?.map((client, i) => (
          <div
            key={i}
            className="text-sm text-left font-semibold  px-2 py-1 rounded-md bg-backgroundAlt rounded-md border border-border-400"
          >
            {client.firstName} {client.lastName}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="xs" className="ml-2">
                  Create Client
                </Button>
              </DialogTrigger>
              <ClientForm authRouter={authRouter} firstName={client.firstName} lastName={client.lastName} />
            </Dialog>
          </div>

        ))}
      </div>

    </div>
  );
}

export default NotificationsAlert;