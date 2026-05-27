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
      className: "text-red-500 bg-red-50",
      glowOnMount: data.urgentCases > 0,
    },
    {
      data: data.followUps,
      label: "Follow-ups",
      subLabel: "Awaiting Response",
      filter: "FOLLOW_UP",
      icon: ClipboardList,
      color: "blue",
      className: "text-blue-500 bg-blue-50",
      glowOnMount: data.followUps > 0,
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
      color: "orange",
    },
  ];

  return (
    <div className={`flex flex-wrap ${className}`}>
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
            glow={stat.glow}
            glowOnMount={stat.glowOnMount}
          />
        </div>
      ))}
    </div>
  );
}

function DashStatCard({ data, label, subLabel, onClick, active, icon: Icon, color, glow, glowOnMount }) {
  const iconStyles = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-700",
    orange: "bg-orange-50 text-orange-600",
  };

  const iconColor = iconStyles[color] || iconStyles.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex-1 p-md flex h-full rounded-none w-full items-center justify-between gap-3 border bg-backgroundAlt text-left shadow-sm transition-all duration-150
        ${
          active
            ? "border-primary bg-primaryLight/40 ring-2 ring-primary/30 shadow-md"
            : "border-border hover:bg-white hover:shadow-md"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
              active ? "bg-primary text-white" : iconColor
            } ${glowOnMount && color === "red" ? "urgent-glow-on-mount-red" : ""} ${glowOnMount && color === "blue" ? "urgent-glow-on-mount-blue" : ""}`}
          >
            <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate text-xs sm:text-sm font-semibold text-foreground">
            {label}
          </h3>

          <p className="mt-1 line-clamp-2 text-[12px] sm:text-[14px] text-muted">
            {subLabel}
          </p>
        </div>
      </div>

      <p className="shrink-0 text-1xl font-bold leading-none text-primaryDark sm:text-2xl">
        {data}
      </p>
    </button>
  );
}
export default DashStats;