
function getAllDashboardStats(clients, referrals) {
  const totalClients = clients.filter(client => client.status === "ENROLLED").length;
  const urgentCases = clients.filter(client => client.referrals.some(referral => referral.isPriority)).length;
  const followUps = clients.filter(client => { 
    return client.referrals.some(referral => {
      const followUpDate = new Date(referral.followUpDate);
      const today = new Date();
      return followUpDate > today;
    });
  }).length;
  const newClients = clients.filter(client => {
    const createdAt = new Date(client.createdAt);
    const today = new Date();
    return (today - createdAt) / (1000 * 60 * 60 * 24) <= 30; // last 30 days
  }).length;
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const housedClients = clients.filter((client) => {
  return (
    client.status === "HOUSED" &&
    new Date(client.updatedAt) >= oneYearAgo
  );
}).length;

  return { totalClients, getAllDashboardStats, urgentCases, followUps, newClients, housedClients };
}


module.exports = { getAllDashboardStats }

