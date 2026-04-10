function DashStats() {
  return (
    <div className="w-full grid grid-cols-4 grid-rows-2 gap-4">
      <DashStatCard />
      <DashStatCard />
      <DashStatCard />
      <DashStatCard />
    </div>
  );
}

function DashStatCard() {
  return (
    <div className="row-span-2 bg-gray-100 rounded-lg p-4 shadow-sm">
      
    </div>
  );
}

export default DashStats;