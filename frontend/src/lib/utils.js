import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import {
  Home,
  Briefcase,
  HeartPulse,
  Scale,
  DollarSign,
  AlertCircle,
  Package,
} from "lucide-react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const RESOURCE_CONFIG = {
  HOUSING: {
    label: "Housing",
    icon: Home,
  },
  EMPLOYMENT: {
    label: "Employment",
    icon: Briefcase,
  },
  MEDICAL: {
    label: "Medical",
    icon: HeartPulse,
  },
  LEGAL: {
    label: "Legal",
    icon: Scale,
  },
  FINANCIAL_ASSISTANCE: {
    label: "Financial Assistance",
    icon: DollarSign,
  },
  SUBSTANCE_USE: {
    label: "Substance Use",
    icon: AlertCircle,
  },
  OTHER: {
    label: "Other",
    icon: Package,
  },
};

export const getDisplayTime = (date, type) => {
  const itemDate = new Date(date);
  itemDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (itemDate - today) / (1000 * 60 * 60 * 24)
  );

  if (type === "referral") {
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "In 1 day";
  if (diffDays === 2) return "In 2 days";
  if (diffDays === 3) return "In 3 days";

  if (diffDays < 0) return "Overdue";
  } else if (type === "notificationAlert") {
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1) return `In ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  } else if (type === "note") {
    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays <= -7 && diffDays >= -30) return `${Math.abs(diffDays)} days ago`;
  }
  return itemDate.toLocaleDateString();
};

export async function setLoadDelay(setLoading, delay = 2000) {
  const start = Date.now();
  setLoading(true);
  await new Promise(res => setTimeout(res, delay));
  // ensure at least 500ms loading time
  const elapsed = Date.now() - start;
  const minTime = 500;

    if (elapsed < minTime) {
      await new Promise(res => setTimeout(res, minTime - elapsed));
    }
    setLoading(false);
}

export function getAllDashboardStats(clients, referrals) {
  const totalClients = clients.length;
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

  return { totalClients, urgentCases, followUps, newClients };
}

export function getClientStats(client) {
  if (!client.referrals) {
    return {};
  }
  const totalReferrals = client.referrals.length;
  const urgentReferrals = client.referrals.filter(referral => referral.isPriority).length;
  const upcomingFollowUps = client.referrals.filter(referral => {
    const followUpDate = new Date(referral.followUpDate);
    const today = new Date();
    return followUpDate > today;
  }).length;
  const expiredFollowUps = client.referrals.filter(referral => {
    const followUpDate = new Date(referral.followUpDate);
    const today = new Date();
    return followUpDate < today && referral.followUpDate !== null && referral.status !== "COMPLETED"; 
  }).length;

  return { totalReferrals, urgentReferrals, upcomingFollowUps, expiredFollowUps };
}
