const timelineItems = [
  {
    title: "Housing application status updated to INQUIRED",
    description: "Awaiting response from housing authority",
    date: "Mar 20, 2024 4:45 PM",
    color: "bg-yellow-500",
  },
  {
    title: "Added Permanent Housing Application",
    description: "",
    date: "Jan 15, 2024 11:30 AM",
    color: "bg-green-500",
  },
  {
    title: "Client enrolled in shelter program",
    description: "Initial intake completed by Sarah Martinez",
    date: "Jan 10, 2024 9:00 AM",
    color: "bg-blue-500",
  },
];

export default function TimelineHistory() {
  return (
    <div className="rounded-xl border bg-card p-6 text-card-foreground">
      <h2 className="mb-8 text-lg font-semibold">Timeline History</h2>

      <div className="space-y-6">
        {timelineItems.map((item, index) => (
          <div key={index} className="relative grid grid-cols-[18px_1fr_auto] gap-3">
            {index !== timelineItems.length - 1 && (
              <div className="absolute left-[5px] top-4 h-[calc(100%+1.5rem)] w-px bg-border" />
            )}

            <div className={`relative z-10 mt-1 h-3 w-3 rounded-full ${item.color}`} />

            <div>
              <p className="font-semibold leading-none">{item.title}</p>

              {item.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>

            <p className="whitespace-nowrap text-sm text-muted-foreground">
              {item.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ title, description, date, color }) {
  return (
    <div className="relative grid grid-cols-[18px_1fr_auto] gap-3">
      <div className={`relative z-10 mt-1 h-3 w-3 rounded-full ${color}`} />

      <div>
        <p className="font-semibold leading-none">{title}</p>

        {description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <p className="whitespace-nowrap text-sm text-muted-foreground">
        {date}
      </p>
    </div>
  );
}