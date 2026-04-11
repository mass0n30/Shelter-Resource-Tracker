function DashStats({data, className}) {
  return (
    <div className={`flex gap-md ${className}`}>
      <DashStatCard />
      <DashStatCard />
      <DashStatCard />
      <DashStatCard />
    </div>
  );
}

function DashStatCard({data}) {
  return (
    <div className={`flex-1  bg-gray-100 rounded-lg shadow-sm p-4 flex flex-col items-center justify-center`}>
      
    </div>
  );
}

export default DashStats;