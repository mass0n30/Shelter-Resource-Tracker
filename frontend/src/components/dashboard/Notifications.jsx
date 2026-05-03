import { Bell, ChevronDown, ChevronUp, Notebook } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownNoteFilter } from "../partials/Dropdown";
import NoteForm from "../forms/NoteForm";
import { useAsyncStatus } from "../partials/Loading";
import { getDisplayTime } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent
} from "@/components/ui/dialog";
import { Chevron } from "react-day-picker";

const groupLabels = {
  overdueToday: "Overdue (Yesterday)",
  overdueRecent: "Overdue (Last 3 Days)",
  overdueWeek: "Overdue (This Week)",
  today: "Today",
  soon: "Next Few Days",
  week: "This Week",
  future: "Upcoming",
};


function ActionButton({ children, tooltip, className, onClick, isLoading }) {
  return (
    <button
      disabled={isLoading}
      className={`relative group px-2 py-1 rounded-md disabled:opacity-50 ${className}`}
      onClick={onClick}
    >
      {isLoading ? "..." : children}

      <span className="absolute left-1/2 -translate-x-1/2 -top-7 whitespace-nowrap 
        bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 
        group-hover:opacity-100 transition pointer-events-none z-50">
        {tooltip}
      </span>
    </button>
  );
}

function ActionButtons({ item, navigate, setLoading, handleAction, loadingId }) {
  const isLoading = loadingId === item.id;

  return (
    <div className="flex gap-2 flex-wrap">
      {item.client && (
        <ActionButton
          className="bg-green-100 text-black"
          tooltip="Go to Profile"
          isLoading={false}
          onClick={(e) => {
            e.stopPropagation();
            setLoading(true);
            navigate(`/dashboard/clients/${item.client.id}`);
          }}
        >
          {item.client.firstName}
        </ActionButton>
      )}

      <ActionButton
        className="bg-blue-500 text-white"
        tooltip="Mark Complete"
        isLoading={isLoading}
        onClick={(e) => {
          e.stopPropagation();
          handleAction(item.type, item, "complete");
        }}
      >
        Complete
      </ActionButton>

      {item.type === "resource" && (
        <ActionButton
          className="bg-red-500 text-white"
          tooltip="Mark Closed"
          isLoading={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            handleAction(item.type, item, "closed");
          }}
        >
          Closed
        </ActionButton>
      )}

      <ActionButton
        className="bg-gray-500 text-white"
        tooltip="Delete"
        isLoading={isLoading}
        onClick={(e) => {
          e.stopPropagation();
          handleAction(item.type, item, "delete");
        }}
      >
        Delete
      </ActionButton>
    </div>
  );
}

function TimelineItem({
  item,
  isExpanded,
  toggleItem,
  navigate,
  setLoading,
  handleAction,
  loadingId,
  noteToggle,
}) {
  return (
    <li
      onClick={() => toggleItem(item.id)}
      className="py-md border-b border-gray-200 py-2 cursor-pointer hover:bg-gray-50 transition"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start">
          <span className="font-medium">
            {item.type === "resource" ? "🏠 " : "📝 "}
            {item.type === "note" && item.client
              ? `Note for ${item.client.firstName} ${item.client.lastName}`
              : item.label}
            {item.type === "note" && !item.client && item.title ? `: ${item.title}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-1">

          <span className="text-sm text-muted text-right ml-1">
            {!noteToggle ? getDisplayTime(item.date, true) : item.date.toLocaleDateString([], {
              month: "short",
              day: "numeric",
              year: "2-digit",
            })}
          </span>
          <span className="text-xs text-muted ">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3 text-muted font-bold" />
            )}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 text-xs text-muted-foreground space-y-2">
          <div className="wrap p-sm bg-yellow-100 rounded-md text-sm text-left italic">
            {item.type === "note" ? item.content : item.purpose}
          </div>
          {item.noteReminder && (
            <span className="text-xs text-muted italic text-right block text-red-500">
              Reminder: {item.noteReminder.toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "2-digit",
              })}
            </span>
          )}
          {item.reminderAt && (
            <span className="text-xs text-muted italic text-right block text-red-500">
              Follow-up: {new Date(item.reminderAt).toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "2-digit",
              })}
            </span>
          )}
          <ActionButtons
            item={item}
            navigate={navigate}
            setLoading={setLoading}
            handleAction={handleAction}
          />
        </div>
      )}
    </li>
  );
}

function Notifications({
  className,
  userNotes,
  userReferrals,
  globalNotes,
  globalReferrals,
  fetchUpdatedData,
  authRouter,
}) {
  const [toggle, setToggle] = useState("reminders");
  const [expandedId, setExpandedId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [viewedNotes, setViewedNotes] = useState({
    notes: userNotes,
    filterMsg: "Personal Notes",
  });

  const { success, setSuccess, loading, setLoading, error, setError } = useAsyncStatus({loadingDuration: 2000, successDuration: 3000});

  const navigate = useNavigate();

  const toggleItem = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAction = async (type, item, action) => {
    try {
      // id for loader on specific item from action trigger
      setLoadingId(item.id);

      const base =
        type === "note"
          ? `/dashboard/notes/${item.rawId}`
          : `/dashboard/referrals/${item.rawId}`;

      const endpoint =
        action === "complete"
          ? `${base}/complete`
          : action === "delete"
          ? `${base}/delete`
          : `${base}/closed`;

      await authRouter.post(endpoint);
      setSuccess(true);
      setExpandedId(null);
      setSuccess(true);
      // trigger refetch in parent to update ALL data after action
      fetchUpdatedData(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const timeline = [];

  userReferrals?.forEach((ref) => {
    if (!ref.followUpDate) return;

    timeline.push({
      id: `ref-${ref.id}`,
      rawId: ref.id,
      type: "resource",
      label: ref.organizationName,
      purpose: ref.purpose,
      date: new Date(ref.followUpDate),
      isPriority: ref.isPriority || false,
      client: ref.client,
    });
  });

  userNotes?.forEach((note) => {
    if (!note.setReminder || !note.reminderAt) return;

    timeline.push({
      id: `note-${note.id}`,
      rawId: note.id,
      type: "note",
      content: note.content,
      label: note?.title || null,
      date: new Date(note.reminderAt),
      isPriority: false,
      client: note.client,
    });
  });

  // putting priority referrals/notes at top of timeline, then sorting by date within priority vs non-priority groups
  timeline.sort((a, b) => {
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    return a.date - b.date;
  });

  const groups = {
    overdueToday: [],
    overdueRecent: [],
    overdueWeek: [],
    today: [],
    soon: [],
    week: [],
    future: [],
  };

  timeline.forEach((item) => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (itemDate - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      if (diffDays === -1) groups.overdueToday.push(item);
      else if (diffDays >= -3) groups.overdueRecent.push(item);
      else groups.overdueWeek.push(item);
      return;
    }

    if (diffDays === 0) {
      groups.today.push(item);
      return;
    }

    if (diffDays <= 3) {
      groups.soon.push(item);
      return;
    }

    if (diffDays <= 7) {
      groups.week.push(item);
      return;
    }

    groups.future.push(item);
  });

  return (
    <div className={`${className} h-full flex flex-col`}>
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          {success && (
            <div className="text-green-600 font-medium">
              Action completed successfully!
            </div>
          )}
          <h3 className="text-md font-semibold">
            {toggle === "reminders" ? "Reminders" : "Notes"}
          </h3>

          {toggle === "notes" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Create Note</Button>
              </DialogTrigger>
              <DialogContent>
                <NoteForm
                  authRouter={authRouter}
                  setSuccess={setSuccess}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => setToggle("reminders")}
            variant="outline"
            className={`flex-1 ${toggle === "reminders" ? "border-primary" : ""}`}
          >
            <Bell className="mr-1 w-4 h-4" />
            Reminders
          </Button>

          <Button
            onClick={() => setToggle("notes")}
            variant="outline"
            className={`flex-1 ${toggle === "notes" ? "border-primary" : ""}`}
          >
            <Notebook className="mr-1 w-4 h-4" />
            Notes
          </Button>
        </div>

        {toggle === "notes" && (
          <>
            <DropdownNoteFilter
              setViewedNotes={setViewedNotes}
              noteMsg={viewedNotes.filterMsg}
              userNotes={userNotes}
              globalNotes={globalNotes}
            />

            <div className="mt-2 text-sm font-medium text-left italic">
              {viewedNotes.filterMsg}
            </div>
          </>
        )}
      <div className="flex-1 overflow-y-auto">
        <ul className="mt-2 text-sm">
          {toggle === "reminders" ? (
            Object.entries(groups).map(([key, items]) =>
              items.length > 0 ? (
                <div key={key} className="mb-2">

                  <p className="text-xs font-semibold text-muted mb-1">
                    {groupLabels[key]}
                  </p>

                  {items.map((item) => (
                    <TimelineItem
                      key={item.id}
                      item={item}
                      isExpanded={expandedId === item.id}
                      toggleItem={toggleItem}
                      navigate={navigate}
                      handleAction={handleAction}
                      loadingId={loadingId}
                      setLoading={setLoading}
                      noteReminder={item.noteReminder}
                    />
                  ))}
                </div>
              ) : null
            )
          ) : (
            viewedNotes?.notes.map((note) => {
              const id = `note-${note.id}`;
              return (
                <TimelineItem
                  key={id}
                  item={{
                    id,
                    rawId: note.id,
                    type: "note",
                    content: note.content,
                    label: note?.title || null,
                    date: new Date(note.createdAt),
                    client: note.client,
                    noteToggle: true,
                    noteReminder: note.reminderAt ? new Date(note.reminderAt) : null,
                  }}
                  isExpanded={expandedId === id}
                  toggleItem={toggleItem}
                  navigate={navigate}
                  handleAction={handleAction}
                  loadingId={loadingId}
                  noteToggle={true}
                />
              );
            })
          )}
        </ul>
        </div>
      </div>
    </div>
  );
}

export default Notifications;