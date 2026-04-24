function DashStats({data, className}) {
  return (
    <div className={`flex flex-col gap-md ${className} md:flex-row`}>
      <div className="flex-1 flex gap-md">
        {/* Urgent cases set from isPriority in Referrals for clients */}
        <DashStatCard data={data.urgentCases} label={"Urgent Cases"} subLabel={"Needs Attention"} />
        {/*When set followup dates are past due or two days away? */}
        <DashStatCard data={data.followUps} label={"Follow-ups"} subLabel={"Awaiting Response"} />
      </div>
      <div className="flex-1 flex gap-md">
        {/* Total clients enrolled in the program, can also be broken down by active vs inactive, or by program type */}
        <DashStatCard data={data.totalClients} label={"Total Clients"} subLabel={"Enrolled"} />
        {/* New clients added in the last 30 days, can also be broken down by program type or referral source */}
        <DashStatCard data={data.newClients} label={"New Clients"} subLabel={"Last 30 Days"} />
      </div>
    </div>
  );
}

function DashStatCard({data, label, subLabel}) {
  return (
    <div className={`flex-1 bg-backgroundAlt rounded-md shadow-md p-4 flex lg:flex-col items-center justify-around gap-sm`}>
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