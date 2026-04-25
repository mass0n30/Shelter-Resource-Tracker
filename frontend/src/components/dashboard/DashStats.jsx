function DashStats({
  data,
  className,
  dashStatFilter,
  setDashStatFilter,
}) {
  return (
    <div className={`flex flex-col gap-md ${className} md:flex-row`}>

      <div className="flex-1 flex gap-md">

        <DashStatCard
          data={data.urgentCases}
          label="Urgent Cases"
          subLabel="Needs Attention"
          active={dashStatFilter === "URGENT"}
          onClick={() => setDashStatFilter("URGENT")}
        />

        <DashStatCard
          data={data.followUps}
          label="Follow-ups"
          subLabel="Awaiting Response"
          active={dashStatFilter === "FOLLOW_UP"}
          onClick={() => setDashStatFilter("FOLLOW_UP")}
        />

      </div>

      <div className="flex-1 flex gap-md">

        <DashStatCard
          data={data.totalClients}
          label="Total Clients"
          subLabel="Enrolled"
          active={dashStatFilter === "ALL"}
          onClick={() => setDashStatFilter("ALL")}
        />

        <DashStatCard
          data={data.newClients}
          label="New Clients"
          subLabel="Last 30 Days"
          active={dashStatFilter === "NEW"}
          onClick={() => setDashStatFilter("NEW")}
        />

      </div>
    </div>
  );
}

function DashStatCard({ data, label, subLabel, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={`flex-1 bg-backgroundAlt rounded-md shadow-md p-4 flex lg:flex-col items-center justify-around gap-sm
        cursor-pointer select-none transition-all duration-150
        ${active 
          ? "ring-2 ring-blue-500 shadow-lg" 
          : "hover:shadow-lg hover:bg-gray-100"}
      `}
    >
      <div>
        <h3 className="text-xs font-semibold md:text-sm">{label}</h3>
        <p className="text-xs font-normal text-muted md:text-sm">{subLabel}</p>
      </div>

      <div>
        <p className="text-2xl font-bold">{data}</p>
      </div>
    </div>
  );
}
export default DashStats;