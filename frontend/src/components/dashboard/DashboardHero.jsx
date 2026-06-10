import {
  Users,
  AlertTriangle,
  ClipboardList,
  Clock,
  House,
} from "lucide-react";


function DashboardHero({
  dashStats,
  user,
  dashStatFilter,
  setDashStatFilter,
  className = "",
}) {
  const firstName =
    user?.firstName ||
    user?.name?.split(" ")?.[0] ||
    user?.username?.split("@")?.[0];

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isMorning = today.getHours() < 12 && today.getHours() >= 6;
  const isAfternoon = today.getHours() >= 12 && today.getHours() < 18;
  const isEvening = today.getHours() >= 18 && today.getHours() < 20;
  const isNight = today.getHours() >= 20 || today.getHours() < 6;

  const enrolledCount = dashStats?.totalClients ?? 0;


  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-r from-[#1b46bd] to-[#123797] text-white ${className}`}
    >

      <div className="relative z-10 px-md pt-md sm:px-lg">
        <p className="text-md sm:text-md font-semibold uppercase tracking-[0.18em] text-blue-200/90">
          {isMorning && "Good Morning"}
          {isAfternoon && "Good Afternoon"}
          {isEvening || isNight && "Good Evening"}
    
        </p>

        <h2 className="mt-1 text-md text-left font-bold leading-tight tracking-[-0.03em] text-white sm:text-2xl">
          Welcome back, {firstName}
        </h2>

        <p className="mt-1 text-sm font-medium text-blue-200/80">
          {formattedDate} · {enrolledCount} clients enrolled
        </p>
      </div>

      <HeroDashStats
        dashStats={dashStats}
        dashStatFilter={dashStatFilter}
        setDashStatFilter={setDashStatFilter}
      />
    </section>
  );
}

function HeroDashStats({ dashStats, dashStatFilter, setDashStatFilter }) {
  
  const stats = [
    {
      data: dashStats?.urgentCases ?? 0,
      label: "Urgent Cases",
      subLabel: "Needs Attention",
      filter: "URGENT", 
      icon: AlertTriangle,
      iconClassName: "text-red-400",
    },
    {
      data: dashStats?.followUps ?? 0,
      label: "Follow-ups",
      subLabel: "Awaiting Response",
      filter: "FOLLOW_UP",
      icon: ClipboardList,
      iconClassName: "text-blue-400",
    },
    {
      data: dashStats?.totalClients ?? 0,
      label: "Total Clients",
      subLabel: "Enrolled",
      filter: "ENROLLED",
      icon: Users,
      iconClassName: "text-green-300",
    },
    {
      data: dashStats?.newClients ?? 0,
      label: "New Clients",
      subLabel: "Last 30 Days",
      filter: "NEW",
      icon: Clock,
      iconClassName: "text-yellow-300",
    },
    {
      data: dashStats?.housedClients ?? 0,
      label: "Housed Clients",
      subLabel: "Past Year",
      filter: "HOUSED",
      icon: House,
      iconClassName: "text-orange-300",
    },
  ];

  return (
    <div className="relative shadow-lg shadow-primaryGlow md:w-[97%] md:mx-auto rounded-tl-lg rounded-tr-lg overflow-hidden z-10 mt-md grid grid-cols-1 bg-white/[0.075] md:grid-cols-5">
      {stats.map((stat) => (
        <HeroStatCard
          key={stat.filter}
          stat={stat}
          active={dashStatFilter === stat.filter}
          onClick={() => {
            setDashStatFilter(stat.filter);
          }}
        />
      ))}
    </div>
  );
}

function HeroStatCard({ stat, active, onClick }) {
  const Icon = stat.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[80px] rounded-none items-center gap-3 border-r border-t border-white/10 px-5 py-3 text-left transition hover:bg-white/10 ${
        active ? "bg-primaryDark" : ""
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
          active ? "bg-white/15" : "bg-white/35"
        }`}
      >
        <Icon
          className={`h-4 w-4 ${
            active ? stat.iconClassName : "text-white"
          }`}
        />
      </div>

      <div className="flex min-w-0  gap-sm items-center justify-center">
        <div className="text-[24px] min-w-[28px] lg:text-xl font-bold leading-none tracking-[-0.04em] text-white">
          {stat.data}
        </div>
        <div>
          <div className="mt-1 truncate text-[12px] lg:text-sm font-bold leading-tight text-blue-100/90">
            {stat.label}
          </div>
          <div className="truncate text-[10px] lg:text-xs font-medium leading-tight text-blue-200/65">
            {stat.subLabel}
          </div> 
      </div>
      </div>
    </button>
  );
}

export default DashboardHero;