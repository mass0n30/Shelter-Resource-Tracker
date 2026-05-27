import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CircleAlert, User, Users } from "lucide-react";
import ClientForm from "../forms/ClientForm";
import { getDisplayTime } from "@/lib/utils";

function NotificationsAlert({
  found,
  unfound,
  SetLoading,
  authRouter,
  className,
  openForm,
  setOpenForm,
}) {
  const displayTime = getDisplayTime(
    unfound?.createdAt || found?.createdAt,
    "notificationAlert"
  );

  if (!unfound && !found) return null;

  const unfoundClients = unfound?.data || [];
  const foundClients = found?.data || [];
  const foundCount = foundClients.length;

  return (
    <div className={`flex flex-col p-lg gap-3 ${className || ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h3 className="text-sm text-left font-semibold text-foreground">
            Summary
          </h3>

          {displayTime && (
            <p className="text-[12px] text-muted-foreground italic">
              {foundCount} clients stayed {displayTime}
            </p>
          )}
        </div>

        <span className="w-fit text-[11px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
          {unfoundClients.length} unmatched
        </span>
      </div>

      {unfound?.message && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          <Users className="inline mr-1 mb-1" size={14} />
          {unfound.message}
        </p>
      )}

      <div className="flex flex-col gap-2 overflow-y-auto max-h-48 pr-1">
        {unfoundClients.map((client, i) => {
          const dialogKey = `client-${i}`;

          return (
            <div
              key={dialogKey}
              className="flex items-center justify-between gap-2 text-sm text-left px-3 py-2 rounded-lg bg-primaryLight/25 border border-primary/10"
            >
              <span className="font-medium text-foreground truncate">
                {client.firstName} {client.lastName}
              </span>

              <Dialog
                open={openForm === dialogKey}
                onOpenChange={(isOpen) =>
                  setOpenForm(isOpen ? dialogKey : null)
                }
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="xs"
                    className="shrink-0 text-xs bg-white/80 hover:bg-primaryLight/60 border-primary/20 rounded-lg"
                  >
                    Create
                  </Button>
                </DialogTrigger>

                {openForm === dialogKey && (
                  <ClientForm
                    authRouter={authRouter}
                    firstName={client.firstName}
                    lastName={client.lastName}
                    setOpenForm={setOpenForm}
                  />
                )}
              </Dialog>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default NotificationsAlert;