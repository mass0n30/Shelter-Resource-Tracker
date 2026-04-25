import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getAllDashboardStats(clients, referrals) {
  const totalClients = clients.length;
  const urgentCases = clients.filter(client => client.referrals.some(referral => referral.isPriority)).length;
  const followUps = referrals.filter(referral => {
    const followUpDate = new Date(referral.followUpDate);
    const today = new Date();
    return followUpDate > today;
  }).length;
  const newClients = clients.filter(client => {
    const createdAt = new Date(client.createdAt);
    const today = new Date();
    return (today - createdAt) / (1000 * 60 * 60 * 24) <= 30; // last 30 days
  }).length;

  return { totalClients, urgentCases, followUps, newClients };
}
