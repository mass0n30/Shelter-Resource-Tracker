import {
  SquareChartGantt,
  UserPlus,
  DoorOpen,
  House,
  Snowflake,
  ClipboardPlus,
  CalendarClock,
  CircleCheck,
  Clock,
  History,
} from "lucide-react";

function GetTimeLineHistoryItems(clientData) {
  if (!clientData) return [];

  const items = [];

  // 1. Client created / first entered into DB
  if (clientData.createdAt) {
    items.push({
      title: "Client created",
      description: `Client added to system with status: ${formatStatus(clientData.status)}`,
      date: clientData.createdAt,
      color: "bg-yellow-500",
      type: "client",
    });
  }

  // 2. Enrollment / exit / housed / WC timeline dates
  if (Array.isArray(clientData.EnrollmentDates)) {
    clientData.EnrollmentDates.forEach((entry) => {
      items.push({
        title: getEnrollmentTitle(entry.type),
        description: getEnrollmentDescription(entry.type, clientData),
        date: entry.date,
        color: getEnrollmentColor(entry.type),
        type: "enrollment",
      });
    });
  }

  // Referrals
  if (Array.isArray(clientData.referrals)) {
    clientData.referrals.forEach((referral) => {
      items.push({
        title: getReferralTitle(referral),
        description: getReferralDescription(referral),
        date: referral.createdAt,
        color: getReferralColor(referral.status),
        type: "referral",
      });

      if (referral.followUpDate) {
        items.push({
          title: `Follow-up: ${referral.organizationName}`,
          description: `Referral status - ${formatStatus(referral.status)}`,
          date: referral.followUpDate,
          color: referral.isPriority ? "bg-red-500" : "bg-blue-500",
          type: "follow-up",
        });
      }

      if (referral.closedAt) {
        items.push({
          title: `Referral closed: ${referral.organizationName}`,
          description: referral.summary || "Referral was closed.",
          date: referral.closedAt,
          color: "bg-gray-500",
          type: "referral-closed",
        });
      }
    });
  }

  return items
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
}

export default function TimelineHistory({ clientData }) {
  const timelineItems = GetTimeLineHistoryItems(clientData);

  return (
    <div className=" h-full bg-background p-6 text-card-foreground shadow-sm">
      <div className="mb-8 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primaryLight text-primary">
            <SquareChartGantt size={20} />
          </div>

          <h2 className="text-lg text-left font-semibold">
            Timeline History
          </h2>

          <p className="mt-1 text-sm text-muted">
            Enrollment, exits, referrals, and follow-ups for this client.
          </p>
        </div>
      </div>

      {timelineItems.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryLight text-primary">
            <History size={18} />
          </div>

          <p className="text-sm font-semibold">No timeline history yet</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Enrollment dates and referrals will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6 h-full overflow-y-auto pr-2">
          {timelineItems.map((item, index) => (
            <TimelineItem
              key={`${item.type}-${item.date}-${index}`}
              item={item}
              isLast={index === timelineItems.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineItem({ item, isLast }) {
  const Icon = getTimelineIcon(item);

  return (
    <div className="relative flex gap-3">
      {!isLast && (
        <div className="absolute left-[15px] top-8 h-[calc(100%+1.25rem)] w-px bg-border" />
      )}

      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primaryLight shadow-sm ring-4 ring-background ${getTimelineIconColor(item.color)}`}
      >
        <Icon size={15} strokeWidth={2.4} />
      </div>

      <div className="min-w-0 flex-1 rounded-lg border bg-backgroundAlt px-3 py-3 transition">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="font-semibold leading-snug text-foreground">
              {item.title}
            </p>

            {item.type && (
              <span className="inline-flex items-center rounded-full border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {formatStatus(item.type)}
              </span>
            )}
          </div>

          <p className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:text-sm">
            <Clock size={13} />
            {formatTimelineDateOnly(item.date)}
          </p>
        </div>

        {item.description && (
          <p className="mt-2 border-l-2 border-border pl-3 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

// helpers
function getTimelineIcon(item) {
  if (item.type === "follow-up") return CalendarClock;
  if (item.type === "referral") return ClipboardPlus;
  if (item.type === "referral-closed") return CircleCheck;

  if (item.type === "enrollment") {
    if (item.title?.toLowerCase().includes("enrolled")) return UserPlus;
    if (item.title?.toLowerCase().includes("exited")) return DoorOpen;
    if (item.title?.toLowerCase().includes("housed")) return House;
    if (item.title?.toLowerCase().includes("winter")) return Snowflake;
  }

  return History;
}

function getTimelineIconColor(color) {
  const colorMap = {
    "bg-yellow-500": "text-yellow-600",
    "bg-blue-500": "text-blue-600",
    "bg-orange-500": "text-orange-600",
    "bg-green-500": "text-green-600",
    "bg-purple-500": "text-purple-600",
    "bg-red-500": "text-red-600",
    "bg-gray-500": "text-gray-600",
    "bg-gray-400": "text-gray-500",
  };

  return colorMap[color] || "text-primary";
}

function getEnrollmentTitle(type) {
  if (type === "enroll") return "Client enrolled";
  if (type === "exit") return "Client exited";
  if (type === "housed") return "Client housed";
  if (type === "winter-contingency") return "Winter contingency entry";

  return "Enrollment update";
}

function getEnrollmentDescription(type, client) {
  if (type === "enroll") {
    return "Client entered the shelter program.";
  }

  if (type === "exit") {
    return "Client exited the shelter program.";
  }

  if (type === "housed") {
    return "Client moved into housing.";
  }

  if (type === "winter-contingency") {
    return "Client entered through winter contingency.";
  }

  return `${client.firstName} ${client.lastName} had an enrollment status update.`;
}

function getEnrollmentColor(type) {
  if (type === "enroll") return "bg-blue-500";
  if (type === "exit") return "bg-orange-500";
  if (type === "housed") return "bg-green-500";
  if (type === "winter-contingency") return "bg-purple-500";

  return "bg-gray-500";
}

function getReferralTitle(referral) {
  return `Referral added: ${referral.organizationName}`;
}

function getReferralDescription(referral) {
  const parts = [];

  if (referral.resourceType) {
    parts.push(`Type - ${formatStatus(referral.resourceType)}`);
  }

  if (referral.status) {
    parts.push(`Status - ${formatStatus(referral.status)}`);
  }

  if (referral.purpose) {
    parts.push(referral.purpose);
  }

  if (referral.summary) {
    parts.push(referral.summary);
  }

  return parts.join(" • ");
}

function getReferralColor(status) {
  if (status === "INQUIRED") return "bg-gray-500";
  if (status === "REFERRED") return "bg-blue-500";
  if (status === "PENDING") return "bg-yellow-500";
  if (status === "ENROLLED") return "bg-purple-500";
  if (status === "COMPLETED") return "bg-green-500";
  if (status === "CLOSED") return "bg-gray-400";

  return "bg-gray-500";
}

function formatStatus(value) {
  if (!value) return "";

  return String(value)
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLowerCase()
    .replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
}

function formatTimelineDateOnly(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}