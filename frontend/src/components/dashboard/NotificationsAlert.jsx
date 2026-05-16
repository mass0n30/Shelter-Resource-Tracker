import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ClientForm from "../forms/ClientForm";
import { getDisplayTime } from "@/lib/utils";

function NotificationsAlert({ data, SetLoading, authRouter, className, openForm, setOpenForm }) {
  const displayTime = getDisplayTime(data?.createdAt, "notificationAlert");

  if (!data) return null;

  return (
    <div className={`flex flex-col p-4 gap-3 ${className || ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Unmatched Clients
          </h3>

          {displayTime && (
            <p className="text-[11px] text-muted-foreground">
              Found during update {displayTime}
            </p>
          )}
        </div>

        <span className="w-fit text-[11px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
          {data?.data?.length || 0} unmatched
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {data?.message}
      </p>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-48 pr-1">
        {data?.data?.map((client, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 text-sm text-left px-3 py-2 rounded-lg bg-primaryLight/25 border border-primary/10"
          >
            <span className="font-medium text-foreground truncate">
              {client.firstName} {client.lastName}
            </span>

            <Dialog
              open={openForm === "client"}
              onOpenChange={(isOpen) => setOpenForm(isOpen ? "client" : null)}
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

              <ClientForm
                authRouter={authRouter}
                firstName={client.firstName}
                lastName={client.lastName}
              />
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsAlert;