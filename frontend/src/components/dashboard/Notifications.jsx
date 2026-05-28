import { Bell, ChevronDown, ChevronUp, Notebook, SquareCheckBig, Globe, House, NotebookText, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../partials/Button";
import { DropdownNoteFilter } from "../partials/Dropdown";
import NoteForm from "../forms/NoteForm";
import { useAsyncStatus } from "../partials/Loading";
import { getDisplayTime } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent
} from "@/components/ui/dialog";
import { CircleAlert } from "lucide-react";

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
    <div className="flex gap-sm flex-wrap">
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
        tooltip="Update Status"
        isLoading={isLoading}
        onClick={(e) => {
          e.stopPropagation();
          handleAction(item.type, item, "complete");
        }}
      >
        {item.completed ? "Mark Incomplete" : "Mark Complete"}
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
      {item.type === "note" && item.visibility === "public" && (
        <ActionButton
          className="bg-yellow-500 text-white"
          tooltip="Mark Private"
          isLoading={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            handleAction(item.type, item, "private");
          }}
        >
          Mark Private
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

function RecentPostedNotes({ notes, className }) {
  const recentPostedNotes = notes
    ?.filter((note) => note.visibility !== "private")
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 4);

  if (!recentPostedNotes?.length) return null;

  return (
    <section className={`w-full bg-yellow-100 border-t border-border px-4 py-4 ${className || ""}`}>
      <h3 className="text-sm text-left font-semibold text-foreground">
        <Globe className="inline h-4 w-4 text-primary mr-1" /> 
        Recent Posted Notes
      </h3>


      <ul className="mt-3 flex flex-col">
        {recentPostedNotes.map((note) => (
          <li
            key={note.id}
            className="border-b border-gray-200 py-3 last:border-b-0"
          >
            <div className="flex flex-col gap-1">

              <div className="flex justify-between">
                <p className="text-sm text-foreground leading-relaxed">
                  {note.content}
                </p>
                <span className="text-xs text-muted-foreground italic">
                  {getDisplayTime(note.createdAt, "note")}
                </span>
              </div>
              {note.author && (
                <span className="text-xs text-muted-foreground">
                  Posted by {note.author.firstName}{" "}
                  {note.author.lastName}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
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
  viewedNotes,
  currentUser,
  currentToggle,
}) {
  const canEdit =
    item.author?.id === currentUser?.id;
  return (
    <li
      onClick={() => toggleItem(item.id)}
      className="py-md border-b border-gray-200 py-2 cursor-pointer hover:bg-gray-50 transition"
    >
      <div className="flex flex-col-reverse xs:flex-row justify-between gap-sm min-w-0">
        <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
          <span className="font-medium flex items-center gap-1 min-w-0 w-full">            
            {item.type === "resource" ? (
              <div className="flex p-sm bg-primaryLight rounded-full items-center justify-center gap-1 shrink-0">
                <House className="inline h-4 w-4 text-primary" />
              </div>
            ) : (
              <div className="flex p-sm bg-primaryLight rounded-full items-center justify-center gap-1 shrink-0">
               { viewedNotes.filterMsg === "Personal Notes" || currentToggle === "reminders" ? <NotebookText className="inline h-4 w-4 text-primary" /> : viewedNotes.filterMsg === "Posted Notes" ? <Globe className="inline h-4 w-4 text-primary" /> : <SquareCheckBig className="inline h-4 w-4 text-primary" /> }
              </div>
            )}

            <span className="min-w-0 leading-snug break-words">
              {item.type === "note"
                ? item.title
                  ? item.title
                  : item.client?.firstName
                  ? `Note for ${item.client?.firstName}`
                  : "General Note"
                : item.label || "Referral"}
            </span>
          </span>

          {noteToggle && viewedNotes?.filterMsg === "Posted Notes" && item.author && (
            <div className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
              {item.author.firstName} {item.author.lastName} 
            </div>
          )}
        </div>

        <div className="flex items-center gap-xs shrink-0">
          <span className="text-sm text-muted text-right whitespace-nowrap">
            {!noteToggle
              ? getDisplayTime(item.date, "referral")
              : getDisplayTime(item.date, "note")}
          </span>

          <span className="text-xs text-muted">
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
            <span className="text-xs italic text-right block text-red-500">
              Follow-up: {new Date(item.noteReminder).toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "2-digit",
              })}
            </span>
          )}
        {/* Show action buttons for Reminders or if Note is User's Note */}
          {(canEdit || !noteToggle) && (
            <ActionButtons
              item={item}
              navigate={navigate}
              setLoading={setLoading}
              handleAction={handleAction}
              loadingId={loadingId}
            />
          )}
        </div>
      )}
    </li>
  );
}

function Notifications({
  className,
  currentUser,
  userNotes,
  userReferrals,
  globalNotes,
  globalReferrals,
  fetchUpdatedData,
  authRouter,
  toggle,
  setToggle,
  openForm,
  setOpenForm,
}) {
  const [view, setView] = useState("latest");
  const [expandedId, setExpandedId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [viewedNotes, setViewedNotes] = useState({
    notes: userNotes,
    filterMsg: "Personal Notes",
  });

  // updating viewed notes from parent response after complete/delete actions on notes
  useEffect(() => {
    setViewedNotes({
      notes: userNotes?.filter((note) => !note.completed) || [],
      filterMsg: "Personal Notes",
    });
  }, [userNotes]);

  const { success, setSuccess, loading, setLoading, error, setError } = useAsyncStatus({loadingDuration: 2000, successDuration: 3000});

  const navigate = useNavigate();

  const toggleItem = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toggleView = () => {
    viewedNotes.notes ? setViewedNotes((prev) => ({...prev, notes: viewedNotes.notes.slice().reverse()})) : null;
    setView((prev) => prev === "latest" ? "oldest" : "latest");
  }

  const handleAction = async (type, item, action) => {
    try {
      // id for loader on specific item from action trigger
      setLoadingId(item.id);

      const base =
        type === "note"
          ? `/dashboard/notes/${item.rawId}`
          : `/dashboard/referrals/${item.rawId}`;

        let endpoint = "";

        if (action === "private") {
          endpoint = `/dashboard/notes/${item.rawId}/visibility`;
        } else {
          endpoint =
            action === "complete"
              ? `${base}/complete`
              : action === "delete"
              ? `${base}/delete`
              : `${base}/closed`;
        }

        if (action === "private") {
          await authRouter.post(endpoint, { visibility: "private" });
        } else {
          await authRouter.post(endpoint);
        }
      setExpandedId(null);
      setSuccess(true);
      setUpdateMessage(action);
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
    if (!ref.followUpDate || ref.status === "COMPLETED" || ref.status === "CLOSED") return;

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
    if (!note.setReminder || !note.reminderAt || note.completed) return;
      timeline.push({
        id: `note-${note.id}`,
        rawId: note.id,
        type: "note",
        title: note.title,
        content: note.content,
        label: note?.title || null,
        date: new Date(note.reminderAt),
        isPriority: false,
        completed: note?.completed,
        client: note.client,
        author: note.author,
      });
  });

  // putting priority referrals/notes at top of timeline, then sorting by date within priority vs non-priority groups
  timeline.sort((a, b) => {
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    return a.date - b.date;
  });

  let groups = {
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

  groups.soon = groups.soon.sort((a, b) => a.date - b.date);
  groups.week = groups.week.sort((a, b) => a.date - b.date);
  groups.future = groups.future.sort((a, b) => a.date - b.date);
  groups.overdueRecent = groups.overdueRecent.sort((a, b) => b.date - a.date);
return (
  <div className={`${className} relative bg-backgroundAlt border border-border flex flex-col overflow-hidden`}>
    <div
      className={`pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-1 rounded-md border border-primary/20 bg-white/95 px-3 py-1.5 text-[10px] xs:text-xs font-medium text-primary shadow-sm transition-all duration-300 ease-out ${
        success
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-2 opacity-0 scale-95"
      }`}
    >
      <CircleAlert className="h-3 w-3 xs:h-4 xs:w-4" />

      <span className="hidden xs:inline">
        {updateMessage === "delete"
          ? "Deleted"
          : updateMessage === "closed"
          ? "Referral Closed"
          : updateMessage === "private"
          ? "Marked Private"
          : updateMessage === "complete"
          ? "Marked Completed"
          : "Updated"}
      </span>
    </div>

    <div className="flex flex-col p-4 overflow-hidden flex-1 min-h-0">
      <div className="flex items-center justify-between mb-sm gap-sm">
        <div className="flex-1 items-start text-left gap-sm">
          <h3 className={`text-md font-semibold `}>
            {toggle === "reminders" ? "Reminders" : "Notes"}
          </h3>
        </div>

        <div className="flex-1 items-center gap-sm">
          {toggle === "notes" && (
            <Dialog
              open={openForm === "note"}
              onOpenChange={(isOpen) => setOpenForm(isOpen ? "note" : null)}
            >
              <DialogTrigger asChild>
                <Button className="w-full p-xs rounded-lg flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:block">Add Note</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-background w-full max-w-lg">
                <NoteForm
                  authRouter={authRouter}
                  setSuccess={setSuccess}
                  fetchUpdatedData={fetchUpdatedData}
                  setOpenForm={setOpenForm}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
        <div className="flex gap-sm mb-sm shrink-0">
          <Button
            onClick={() => setToggle("reminders")}
            className={`flex-1 ${toggle === "reminders" ? " bg-primary text-white" : "bg-white text-muted"}`}
          >
            <Bell className="mr-1 w-4 h-4" />
            Reminders
          </Button>

          <Button
            onClick={() => setToggle("notes")}
            className={`flex-1 ${toggle === "notes" ? "bg-primary text-white" : "bg-white text-muted"}`}
          >
            <Notebook className="mr-1 w-4 h-4" />
            Notes
          </Button>
        </div>

        {toggle === "notes" && (
          <div className="shrink-0">
            <DropdownNoteFilter
              setViewedNotes={setViewedNotes}
              noteMsg={viewedNotes.filterMsg}
              userNotes={userNotes}
              globalNotes={globalNotes}
            />

            <div className="mt-2 text-sm font-medium text-left italic">
              {viewedNotes.filterMsg}
            </div>

            <div
              className="text-xs text-muted-foreground mb-2 text-right"
              onClick={() => toggleView()}
            >
              {view === "latest" ? " Latest" : " Older"}

              <ChevronUp
                className={`w-3 h-3 inline-block ml-1 ${view === "latest" ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        )}
      <div className="flex-1 min-h-0 overflow-y-auto relative">
        <ul className="mt-2 text-sm">
          {toggle === "reminders"
            ? Object.entries(groups).map(([key, items]) =>
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
                        viewedNotes={viewedNotes}
                        currentUser={currentUser}
                        currentToggle={toggle}
                      />
                    ))}
                  </div>
                ) : null
              )
            : viewedNotes?.notes
                ?.filter((note) =>
                  viewedNotes.filterMsg === "Posted Notes"
                    ? note.visibility === "public"
                    : true
                )
                .map((note) => {
                  const id = `note-${note.id}`;

                  return (
                    <TimelineItem
                      key={id}
                      item={{
                        id,
                        rawId: note.id,
                        type: "note",
                        title: note.title,
                        content: note.content,
                        label: note?.title || null,
                        date: new Date(note.createdAt),
                        client: note.client,
                        author: note.author,
                        noteToggle: true,
                        noteReminder: note.reminderAt
                          ? new Date(note.reminderAt)
                          : null,
                        completed: note?.completed,
                        visibility: note.visibility,
                      }}
                      isExpanded={expandedId === id}
                      toggleItem={toggleItem}
                      navigate={navigate}
                      handleAction={handleAction}
                      loadingId={loadingId}
                      noteToggle={true}
                      viewedNotes={viewedNotes}
                      currentUser={currentUser}
                      currentToggle={toggle}
                    />
                  );
                })}

          {toggle === "notes" &&
            viewedNotes?.notes?.filter((note) =>
              viewedNotes.filterMsg === "Posted Notes"
                ? note.visibility === "public"
                : true
            ).length === 0 && (
              <div className="text-center text-muted-foreground py-10">
                No {viewedNotes?.filterMsg} notes found.
              </div>
            )}

          {toggle === "reminders" && timeline.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
              No upcoming reminders found.
            </div>
          )}
        </ul>
      </div>
      </div>

      {toggle === "reminders" && (
        <RecentPostedNotes
          notes={globalNotes}
          className="border-border bg-backgroundAlt"
        />
      )}
    </div>
  );
}




export default Notifications;