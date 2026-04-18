function DashStats({data, className}) {
  return (
    <div className={`flex gap-md ${className}`}>
      {/* Urgent cases set from isPriority in Referrals for clients */}
      <DashStatCard label={"Urgent Cases"} subLabel={"Needs Attention"} />
      {/*When set followup dates are past due or two days away? */}
      <DashStatCard label={"Pending Follow-ups"} subLabel={"Awaiting Response"} />
      {/* Total clients enrolled in the program, can also be broken down by active vs inactive, or by program type */}
      <DashStatCard label={"Total Clients"} subLabel={"Enrolled"} />
      {/* New clients added in the last 30 days, can also be broken down by program type or referral source */}
      <DashStatCard label={"New Clients"} subLabel={"Last 30 Days"} />
    </div>
  );
}

function DashStatCard({data, label, subLabel}) {
  return (
    <div className={`flex-1  bg-gray-100 rounded-md shadow-md p-4 flex flex-col items-center justify-start gap-sm`}>
      <h3 className="text-lg font-semibold sm:text-sm">{label}</h3>
      <p className="text-xs font-normal text-muted">{subLabel}</p>
    </div>
  );
}

export default DashStats;