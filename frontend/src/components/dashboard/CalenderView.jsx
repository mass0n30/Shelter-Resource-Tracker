import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { House, NotebookText, ClockAlert } from "lucide-react";
import { cn } from "@/lib/utils";

// https://daypicker.dev/docs/appearance //

function formatDateKey(date) {
  if (!date) return null;

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeCalendarItems({ referrals = [], notes = [] }) {
  const referralItems = referrals
    .filter((referral) => referral.followUpDate)
    .map((referral) => ({
      id: referral.id,
      type: "referral",
      title: referral.organizationName || "Referral",
      subtitle: referral.purpose || referral.resourceType || "",
      date: referral.followUpDate,
      client: referral.client,
      isPriority: referral.isPriority,
      status: referral.status,
      original: referral,
    }));

  const noteItems = notes
    .filter((note) => note.setReminder && note.reminderAt)
    .map((note) => ({
      id: note.id,
      type: "note",
      title: note.title || "Reminder Note",
      subtitle: note.content || "",
      date: note.reminderAt,
      client: note.client,
      completed: note.completed,
      original: note,
    }));

  return [...referralItems, ...noteItems];
}

function getItemsForDate(items, date) {
  const selectedDateKey = formatDateKey(date);

  return items.filter((item) => {
    return formatDateKey(item.date) === selectedDateKey;
  });
}

function getDatesByType(items, type) {
  return items
    .filter((item) => item.type === type)
    .map((item) => new Date(item.date));
}

function getPriorityDates(items) {
  return items
    .filter((item) => item.isPriority)
    .map((item) => new Date(item.date));
}

export default function Calendar({
  mode = "single",
  selected,
  setSelected,
  calendarItems = [],
  className,
}) {
  const referralDates = getDatesByType(calendarItems, "referral");
  const noteDates = getDatesByType(calendarItems, "note");
  const priorityDates = getPriorityDates(calendarItems);

  return (
    <DayPicker
      mode={mode}
      selected={selected}
      onSelect={(date) => {
        if (date) {
          setSelected(date);
        }
      }}
      navLayout="around"
      modifiers={{
        hasReferral: referralDates,
        hasNote: noteDates,
        isPriority: priorityDates,
      }}
      modifiersClassNames={{
        hasReferral: "font-bold text-primary",
        hasNote: "underline decoration-success decoration-2 underline-offset-4",
        isPriority: "ring-2 ring-destructive",
      }}
      className={cn(
        "h-full z-[2000] flex flex align-center justify-center bg-white p-4 rounded-xl shadow-md border",
        className
      )}
      classNames={{
        months: "flex flex-col gap-1",
        month: "space-y-1",
        caption: "flex justify-between items-center px-2",
        caption_label: "text-sm font-semibold text-foreground",
        nav: "gap-1",
        nav_button: "p-1 hover:bg-secondary rounded-md",

        chevron: "h-4 w-4 fill-primary",
        table: "border-collapse",
        head_row: "flex",
        head_cell: "text-xs text-muted w-9 text-center",

        row: "flex w-full mt-2",
        cell: "w-9 h-9 text-center text-sm p-0 relative",

        day: "w-9 h-9 rounded-md hover:bg-secondary transition text-foreground",
        day_selected: "bg-primary text-white hover:bg-primary",
        day_today: "border border-amber-500",
        day_outside: "text-gray-300",
      }}
    />
  );
}

export function CalendarEmbedded({
  date,
  setDate,
  notes = [],
  referrals = [],
  className,
}) {
  const calendarItems = useMemo(() => {
    return normalizeCalendarItems({ referrals, notes });
  }, [referrals, notes]);

  const selectedItems = getItemsForDate(calendarItems, date);

return (
  <div
    className={cn(
      "mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-md lg:flex-row lg:items-start lg:justify-center",
      className
    )}
  >
    {/* Calendar */}
    <div className="flex w-full justify-center lg:w-[58%]">
      <Calendar
        mode="single"
        selected={date}
        setSelected={setDate}
        calendarItems={calendarItems}
        captionLayout="dropdown"
        className="w-full max-w-2xl border-0 bg-white p-2 text-foreground shadow-none"
      />
    </div>

    {/* Selected Date Panel */}
    <div className="w-full rounded-lg border border-border bg-backgroundAlt p-4 lg:w-[42%]">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          {date
            ? date.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Select a date"}
        </h3>

        <p className="text-xs text-muted">
          {selectedItems.length === 0
            ? "No scheduled items for this day."
            : `${selectedItems.length} item${
                selectedItems.length === 1 ? "" : "s"
              } scheduled`}
        </p>
      </div>

      <div className="max-h-[420px] overflow-y-auto pr-1">
        {selectedItems.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-white p-4 text-sm text-muted">
            Nothing needs attention on this date.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="rounded-md border border-border bg-white p-3 text-sm shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2">
                    {item.type === "referral" ? (
                      <House className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <NotebookText className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {item.type === "referral" ? "Referral: " : "Note: "}
                        {item.title}
                      </p>

                      {item.subtitle && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted">
                          {item.subtitle}
                        </p>
                      )}

                      {item.client && (
                        <p className="mt-1 text-xs text-muted">
                          Client: {item.client.firstName} {item.client.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {item.isPriority && (
                      <div className="flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs text-destructive">
                        <ClockAlert className="h-3 w-3" />
                        Priority
                      </div>
                    )}

                    {item.completed && (
                      <div className="rounded-md bg-green-50 px-2 py-1 text-xs text-success">
                        Done
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-3 text-xs text-muted">
        <div className="flex items-center gap-1">
          <House className="h-3 w-3 text-primary" />
          Referral follow-up
        </div>

        <div className="flex items-center gap-1">
          <NotebookText className="h-3 w-3 text-success" />
          Note reminder
        </div>

        <div className="flex items-center gap-1">
          <ClockAlert className="h-3 w-3 text-destructive" />
          Priority
        </div>
      </div>
    </div>
  </div>
);
}