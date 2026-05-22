import { Users, AlertTriangle, ClipboardList, Clock ,House} from "lucide-react";
function DashStats({ data, className, dashStatFilter, setDashStatFilter }) {
  const stats = [
    {
      data: data.urgentCases,
      label: "Urgent Cases",
      subLabel: "Needs Attention",
      filter: "URGENT",
      icon: AlertTriangle,
      color: "red",
    },
    {
      data: data.followUps,
      label: "Follow-ups",
      subLabel: "Awaiting Response",
      filter: "FOLLOW_UP",
      icon: ClipboardList,
      color: "blue",
    },
    {
      data: data.totalClients,
      label: "Total Clients",
      subLabel: "Enrolled",
      filter: "ALL",
      icon: Users,
      color: "green",
    },
    {
      data: data.newClients,
      label: "New Clients",
      subLabel: "Last 30 Days",
      filter: "NEW",
      icon: Clock,
      color: "yellow",
    },
    {
      data: data.housedClients,
      label: "Housed Clients",
      subLabel: "Past Year",
      filter: "HOUSED",
      icon: House,
      color: "green",
    },
  ];

  return (
    <div className={`flex flex-wrap gap-sm md:gap-md ${className}`}>
      {stats.map((stat) => (
        <div key={stat.filter} className="min-w-[190px] flex-1">
          <DashStatCard
            data={stat.data}
            label={stat.label}
            subLabel={stat.subLabel}
            active={dashStatFilter === stat.filter}
            onClick={() => setDashStatFilter(stat.filter)}
            icon={stat.icon}
            color={stat.color}
          />
        </div>
      ))}
    </div>
  );
}

function DashStatCard({ data, label, subLabel, onClick, active, icon: Icon, color }) {
  const iconStyles = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-700",
  };

  const iconColor = iconStyles[color] || iconStyles.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex-1 flex h-full w-full items-center justify-between gap-3 rounded-md border bg-backgroundAlt p-4 text-left shadow-sm transition-all duration-150
        ${
          active
            ? "border-primary bg-primaryLight/40 ring-2 ring-primary/30 shadow-md"
            : "border-border hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
              active ? "bg-primary text-white" : iconColor
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {label}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-muted">
            {subLabel}
          </p>
        </div>
      </div>

      <p className="shrink-0 text-3xl font-bold leading-none text-primaryDark sm:text-4xl">
        {data}
      </p>
    </button>
  );
}

export default DashStats;