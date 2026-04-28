import { Button } from "../ui/button";

function NotificationsAlert({ data, SetSuccess, SetLoading, SetNewFetch, authRouter }) {

  const handleMarkRead = async () => {
    try {
      await authRouter.post('/dashboard/notes/mark-read');
      SetSuccess(true);
      SetLoading(true);
      SetNewFetch(true);
    } catch (err) {
      console.error(err);
    }
  };
  if (!data) return null;

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      
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
        {data.message}
      </p>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-40">
        {data.data?.map((client, i) => (
          <div
            key={i}
            className="text-sm px-2 py-1 rounded-md bg-muted"
          >
            {client.firstName} {client.lastName}
          </div>
        ))}
      </div>

    </div>
  );
}

export default NotificationsAlert;